import { ethers } from "hardhat";

async function main() {
  const verifierContract = await ethers.getContractFactory("Verifier");
  const verifier = await verifierContract.deploy();
  await verifier.deployed();
  console.log("Verifier deployed to:", verifier.address);

  const BombEscaperContract = await ethers.getContractFactory("BombEscaper");
  const BombEscaper = await BombEscaperContract.deploy(verifier.address);
  await BombEscaper.deployed();

  console.log("BombEscaper deployed to:", BombEscaper.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
