"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let web3;
let selectedAccount;
let contract;

// UI elements

const connectButton = document.querySelector("#btn-connect");
const disconnectButton = document.querySelector("#btn-disconnect");
const mintButton = document.querySelector("#btn-mint");
const burnButton = document.querySelector("#btn-burn");
const refreshButton = document.querySelector("#btn-refresh");

const mintInput = document.querySelector("#input-mint");
const burnInput = document.querySelector("#input-burn");

const alertMessage = document.querySelector("#alert-error-https");
const networkMessage = document.querySelector("#network-name");
const selectedAccountMessage = document.querySelector("#selected-account");
const txHashMessage = document.querySelector("#tx-hash");
const errorMessage = document.querySelector("#alert-error-message");

const accountContainer = document.querySelector("#accounts");
const tableTemplate = document.querySelector("#template-balance");

const txSection = document.querySelector("#tx");
const errorSection = document.querySelector("#error");
const notConnectedSection = document.querySelector("#not-connected");
const connectedSection = document.querySelector("#connected");

function init() {
  console.log("Initializing...");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.hostname !== 'localhost' && location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    alertMessage.style.display = "block";
    connectButton.setAttribute("disabled", "disabled")
    return;
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_PROJECT_ID,
      }
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false,
  });

  console.log("Web3Modal instance is", web3Modal);
}

async function fetchAccountData() {
  web3 = new Web3(provider);
  console.log("Web3 instance is", web3);
  const chainId = await web3.eth.getChainId();
  if (chainId == 4) {
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS_RINKEBY);
  } else {
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS_LOCAL);
  }

  try {
    const chainData = evmChains.getChain(chainId); // this breaks for evmChains if it is local
  } catch (error) {
    console.log(error);
  }

  networkMessage.textContent = (chainId != 4) ? 'local' : chainData.name;

  const accounts = await web3.eth.getAccounts();
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  selectedAccountMessage.textContent = selectedAccount;

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    const ETHBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyETHBalance = parseFloat(ETHBalance).toFixed(4);

    const NFTBalance = await new Promise((resolve, reject) => {
      contract.methods.balanceOf(address).call((err, res) => {
        if (err) reject(err)
        else resolve(res)
      });
    });
    const humanFriendlyNFTBalance = web3.utils.toBN(NFTBalance).toString();
    // Fill in the templated row and put in the document
    const clone = tableTemplate.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".ETHBalance").textContent = humanFriendlyETHBalance;
    clone.querySelector(".NFTBalance").textContent = humanFriendlyNFTBalance;
    accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  notConnectedSection.style.display = "none";
  connectedSection.style.display = "block";
}

async function refreshAccountData() {
  connectedSection.style.display = "none";
  notConnectedSection.style.display = "block";
  connectButton.setAttribute("disabled", "disabled");
  await fetchAccountData(provider);
  connectButton.removeAttribute("disabled");
  burnInput.value = "";
}

async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    console.log("Accounts changed");
    fetchAccountData();
  });
  provider.on("chainChanged", (chainId) => {
    console.log("Chain changed");
    fetchAccountData();
  });
  provider.on("networkChanged", (networkId) => {
    console.log("Network changed");
    fetchAccountData();
  });

  await refreshAccountData();
}

async function onDisconnect() {
  console.log("Killing the wallet connection", provider);
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount = null;

  notConnectedSection.style.display = "block";
  connectedSection.style.display = "none";
}

async function onMint(e) {
  e.preventDefault();
  console.log("Minting...");

  let mintAmount=0;

  txSection.style.display = "none";
  txHashMessage.textContent = "";
  errorSection.style.display = "none";
  errorMessage.textContent = "";

  try {
    mintAmount = JSON.parse(mintInput.value);
    if(mintAmount <= 0) {
      throw new Error('A positive number is required');
    }
  } catch (error) {
    errorSection.style.display = "block";
    errorMessage.textContent = "Invalid input. Must be a number greater than 0.";
    return;
  }

  const amount = web3.utils.toBN(mintAmount);
  const price = await new Promise((resolve, reject) => {
    contract.methods.PRICE().call((err, res) => {
      if (err) reject(err)
      else resolve(res)
    });
  });
  const value = web3.utils.toBN(price).mul(amount);
  const tx = await new Promise((resolve, reject) => {
    contract.methods.mint(amount).send({ from: selectedAccount, value }, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    });
  });
  if (tx) {
    console.log(tx);
    txSection.style.display = "block";
    txHashMessage.setAttribute("href", `https://rinkeby.etherscan.io/tx/${tx}`)
    txHashMessage.textContent = tx;
  }
}

async function onBurn(e) {
  e.preventDefault();
  console.log("Burning...");

  txSection.style.display = "none";
  txHashMessage.textContent = "";
  errorSection.style.display = "none";
  errorMessage.textContent = "";

  let tokenIds;
  try {
    tokenIds = JSON.parse(burnInput.value);
  } catch (error) {
    errorSection.style.display = "block";
    errorMessage.textContent = "Invalid input. Must be an array of token ids.";
    return;
  }

  const tx = await new Promise((resolve, reject) => {
    contract.methods.burn(tokenIds).send({ from: selectedAccount }, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    });
  });
  if (tx) {
    console.log(tx);
    txSection.style.display = "block";
    txHashMessage.setAttribute("href", `https://rinkeby.etherscan.io/tx/${tx}`)
    txHashMessage.textContent = tx;
    burnInput.value = "";
  }
}

window.addEventListener('load', async () => {
  init();
  connectButton.addEventListener("click", onConnect);
  disconnectButton.addEventListener("click", onDisconnect);
  refreshButton.addEventListener("click", refreshAccountData);
  mintButton.addEventListener("click", onMint);
  burnButton.addEventListener("click", onBurn);
});
