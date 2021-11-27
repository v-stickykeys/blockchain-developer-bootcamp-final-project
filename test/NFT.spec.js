const NFT = artifacts.require("NFTCompleted");

const { toBN } = web3.utils;

contract("NFT", async (accounts) => {
  let instance;
  before(async () => {
    instance = await NFT.deployed();
  });
  it("should set owner, name, symbol, and PRICE upon deploy", async () => {
    const owner = accounts[0];
    const name = "BonBonNFT";
    const symbol = "BB";
    const price = toBN(100000000000000000);
    const owner2 = await instance.owner.call();
    const name2 = await instance.name.call();
    const symbol2 = await instance.symbol.call();
    const price2 = await instance.PRICE.call();
    assert.equal(owner, owner2);
    assert.equal(name, name2);
    assert.equal(symbol, symbol2);
    assert.equal(price.toString(), price2.toString());
  });
  it("mint: should give caller token ownership", async () => {
    const price = await instance.PRICE.call();
    const buyer = accounts[1];
    const amount = 5;
    const value = price * amount;
    await instance.mint(amount, { from: buyer, value });

    const balance = await instance.balanceOf.call(buyer);
    assert.equal(balance, amount);

    const owner1 = await instance.ownerOf.call(1);
    const owner5 = await instance.ownerOf.call(5);
    assert.equal(owner1, buyer);
    assert.equal(owner5, buyer);
  });
});
