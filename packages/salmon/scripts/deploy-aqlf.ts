// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // Deploy AQLF
  const AQLF = await hre.ethers.getContractFactory('AquariumLifeForm')
  const aqlf = await AQLF.deploy(
    process.argv[2], // baseURI
    process.argv[3], // Name of collection
    process.argv[4], // Symbol of collection
    process.argv[5], // Mint price
    process.argv[6], // Max mint at once
    process.argv[7], // Amount of tokens reserved
    process.argv[8]  // Max supply of tokens
  )

  await aqlf.deployed()

  console.log(
    'New Aquarium Life Form collection deployed to:',
    aqlf.address
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
