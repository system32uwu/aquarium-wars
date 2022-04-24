import { HardhatUserConfig, task, types } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

import { writeFile, mkdirp, readdir, copy } from 'fs-extra'
import { parseUnits } from '@ethersproject/units'
import { join } from 'path'

require('dotenv').config()

const deployedCollectionsDir = `${__dirname}/../goldfish/contracts/deployedCollections`
const deployedCurrenciesDir = `${__dirname}/../goldfish/contracts/deployedCurrencies`
const abisDir = `${__dirname}/../goldfish/contracts/abis`

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task('deploy-plank', 'Deploys the main ERC-20 in-game token')
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
    const PLANK = await hre.ethers.getContractFactory('Plankton')
    const plank = await PLANK.deploy(supply, beneficiary)

    await plank.deployed()
    const balance = await plank.balanceOf(beneficiary)

    console.log('$PLANK deployed to:', plank.address)
    console.log(
      '$PLANK balance is:',
      hre.ethers.utils.formatEther(balance.toString())
    )

    await mkdirp(deployedCurrenciesDir)

    await writeFile(
      `${deployedCurrenciesDir}/${await plank.symbol()}.json`,
      JSON.stringify(
        {
          address: plank.address,
        },
        null,
        2
      )
    )
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
  .addPositionalParam(
    'price',
    'Mint Price',
    undefined,
    types.string,
    false
  )
  .addPositionalParam(
    'maxMint',
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
  .addPositionalParam('feedFee', 'Feed fee', undefined, types.int, false)
  .addPositionalParam(
    'plank',
    'PLANK address',
    undefined,
    types.string,
    false
  )
  .setAction(
    async (
      {
        baseUri,
        name,
        symbol,
        price,
        maxMint,
        reserved,
        supply,
        plank,
        feedFee,
      },
      hre
    ) => {
      price = parseUnits(price, 'ether')

      const AQLF = await hre.ethers.getContractFactory('AquariumLifeForm')
      const aqlf = await AQLF.deploy(
        baseUri,
        name,
        symbol,
        price,
        maxMint,
        reserved,
        supply,
        plank,
        feedFee
      )

      await aqlf.deployed()

      console.log(`${await aqlf.symbol()} deployed to:`, aqlf.address)

      await mkdirp(deployedCollectionsDir)

      await writeFile(
        `${deployedCollectionsDir}/${symbol}.json`,
        JSON.stringify(
          {
            baseUri,
            name,
            symbol,
            price,
            maxMint,
            reserved,
            supply,
            address: aqlf.address,
          },
          null,
          2
        )
      )

      console.log('saved to:', `${deployedCollectionsDir}/${symbol}.json`)
      await aqlf.pause(false)
    }
  )

task(
  'compile',
  'Compiles smart contracts and copies ABIs of contracts over to goldfish',
  async (_, __, runSuper) => {
    await runSuper() // compile

    const baseDir = `${__dirname}/artifacts/contracts`

    const containerDirs = await readdir(baseDir) // `currencies` & `NFTS`

    for (let dir of containerDirs) {
      const targetDir = await readdir(join(baseDir, dir))

      if (targetDir.length) {
        await copy(join(baseDir, dir, targetDir[0]), abisDir, {
          overwrite: true,
          recursive: true,
          filter: (path) => {
            return path.indexOf('.dbg.json') === -1 // filter out debug files
          },
        }) // copy over to goldfish
      }
    }
  }
)

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
