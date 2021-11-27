const NFT = artifacts.require("NFTCompleted");

const weiPerGwei = 1000000000;
const { toBN, toWei } = web3.utils;

contract("NFT", async (accounts) => {
  let instance;
  let PRICE;
  before(async () => {
    instance = await NFT.deployed();
    PRICE = await instance.PRICE.call();
  });
  it("should set owner, name and symbol upon deploy", async () => {
    const owner = accounts[0];
    const name = "BonBonNFT";
    const symbol = "BB";
    const owner2 = await instance.owner.call();
    const name2 = await instance.name.call();
    const symbol2 = await instance.symbol.call();
    assert.equal(owner, owner2);
    assert.equal(name, name2);
    assert.equal(symbol, symbol2);
  });
  it("mint: should give caller token ownership", async () => {
    const buyer = accounts[1];
    const amount = 5;
    const value = PRICE * amount;
    await instance.mint(amount, { from: buyer, value });

    const balance = await instance.balanceOf.call(buyer);
    assert.equal(balance, amount);

    const array = new Array(amount);
    await Promise.all(array.map(async (v, i) => {
      const owner = await instance.ownerOf.call(i + 1);
      assert.equal(owner, buyer);
    }));
  });
  it("mint: should increase minted by amount", async () => {
    const startingMinted = await instance.minted.call();

    const buyer = accounts[1];
    const amount = toBN(2);
    const value = toBN(PRICE).mul(amount);
    await instance.mint(amount, { from: buyer, value });

    const endingMinted = await instance.minted.call();
    assert.equal(toBN(startingMinted).add(amount).toString(), toBN(endingMinted).toString());
  });
  it("mint: should store caller funds in the contract", async () => {
    const buyer = accounts[2];
    const amount = toBN(11);
    const value = toBN(PRICE).mul(amount);

    const startingBuyerBalance = await web3.eth.getBalance(buyer);
    const startingContractBalance = await web3.eth.getBalance(instance.address);

    const tx = await instance.mint(11, { from: buyer, value });
    const gasPrice = toBN(await web3.eth.getGasPrice());
    const gasUsed = toBN(tx.receipt.cumulativeGasUsed);
    const gasFee = gasPrice.mul(gasUsed);

    const endingBuyerBalance = await web3.eth.getBalance(buyer);
    const endingContractBalance = await web3.eth.getBalance(instance.address);

    assert.equal(toBN(startingBuyerBalance).toString(), toBN(endingBuyerBalance).add(value.add(gasFee)).toString());
    assert.equal(toBN(startingContractBalance).add(value).toString(), endingContractBalance.toString());
  });
  it("burn: should refund caller for burned tokens", async () => {
    assert.equal(true, false);
  });
});
