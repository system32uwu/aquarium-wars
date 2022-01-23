import { HardhatUserConfig, task, types } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-ethernal'

require('dotenv').config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task('deploy-currency', 'Deploys your ERC-20 in-game token')
  .addPositionalParam(
    'supply',
    'Initial Supply',
    undefined,
    types.int,
    false
  )
  .addPositionalParam(
    'beneficiary',
    'Address of the beneficiary',
    undefined,
    types.string,
    false
  )
  .setAction(async ({ supply, beneficiary }, hre) => {
    // await hre.run('compile')

    const PLANK = await hre.ethers.getContractFactory('Plankton')
    const plank = await PLANK.deploy(supply, beneficiary)

    await plank.deployed()

    await hre.ethernal.push({
      name: 'Plankton',
      address: plank.address,
    })

    console.log('$PLANK deployed to:', plank.address)
  })

task('deploy-nft', 'Deploys a new NFT collection')
  .addPositionalParam(
    'baseUri',
    'Base URI',
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    'name',
    'Name of the collection',
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    'symbol',
    'Symbol of the collection',
    undefined,
    types.string,
    false
  )
  .addPositionalParam('price', 'Mint Price', undefined, types.int, false)
  .addPositionalParam(
    'maxmint',
    'Max amount allowed to be minted at once',
    undefined,
    types.int,
    false
  )
  .addPositionalParam(
    'reserved',
    'Amount reserved for events and giveaways',
    undefined,
    types.int,
    false
  )
  .addPositionalParam(
    'supply',
    'Maximum supply',
    undefined,
    types.int,
    false
  )
  .setAction(
    async (
      { baseUri, name, symbol, price, maxmint, reserved, supply },
      hre
    ) => {
      await hre.run('compile')

      const AQLF = await hre.ethers.getContractFactory('AquariumLifeForm')
      const aqlf = await AQLF.deploy(
        baseUri,
        name,
        symbol,
        price,
        maxmint,
        reserved,
        supply
      )

      await aqlf.deployed()

      console.log(`${await aqlf.symbol()} deployed to:`, aqlf.address)
    }
  )

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY]
          : [],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config
