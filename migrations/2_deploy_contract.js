const NFT = artifacts.require("NFTCompleted");

module.exports = async function (deployer) {
  await deployer.deploy(NFT);
  console.log("Migration: Deployed NFT contract");
};
