import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  AquariumLifeForm,
  AquariumLifeForm__factory,
  Plankton,
  Plankton__factory,
} from '../typechain'
import { parsedDecimalValue } from '../util'

const prefix = '[AquariumLifeForm]'

describe(`${prefix} Contract`, () => {
  let AquariumLifeForm: AquariumLifeForm__factory
  let aquariumLifeForms: AquariumLifeForm[] = []

  let planktonInitialSupply = 2 * 10 ** 9 // Print 2 billion PLANK
  let Plankton: Plankton__factory
  let plankton: Plankton

  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let mockPlayer: SignerWithAddress
  let mockPlayer2: SignerWithAddress
  let addrs: SignerWithAddress

  const feedAmount = 100

  beforeEach(async () => {
    ;[owner, addr1, mockPlayer, mockPlayer2, addrs] =
      await ethers.getSigners()

    AquariumLifeForm = (await ethers.getContractFactory(
      'AquariumLifeForm'
    )) as AquariumLifeForm__factory

    let AQMA = await AquariumLifeForm.deploy(
      'http://127.0.0.1/api/aqlf/AQMA', // uri
      'Mutant Anchovies', // name
      'AQMA', // symbol
      ethers.utils.parseUnits('1', 'ether'), // mint cost
      20, // max to batch mint
      100, // reserved for giveaways
      10000 // 10k AQMA
    )

    let AQRS = await AquariumLifeForm.deploy(
      'http://127.0.0.1/api/aqlf/aqrs', // uri
      'Robo Sharkies', // name
      'AQRS', // symbol
      parsedDecimalValue(0.1), // mint cost
      20, // max to batch mint
      100, // reserved for giveaways
      7500 // 7.5k AQRS
    )

    aquariumLifeForms.push(AQMA)
    aquariumLifeForms.push(AQRS)

    await AQMA.deployed()
    await AQRS.deployed()

    Plankton = (await ethers.getContractFactory(
      'Plankton'
    )) as Plankton__factory
    plankton = await Plankton.deploy(planktonInitialSupply, owner.address)

    await plankton.deployed()
  })

  describe(`${prefix} - Deploy`, () => {
    it('Should have minted 1 NFT upon contract creation', async () => {
      expect(
        await aquariumLifeForms[0].totalSupply(),
        'AQMA was not deployed'
      ).to.equal(1)

      expect(
        await aquariumLifeForms[0].balanceOf(owner.address),
        'AQMA #1 wasnt delivered'
      ).to.equal(1)
    })
  })

  describe(`${prefix} - Mint AQMA`, () => {
    it('Should mint 20 NFTs', async () => {
      let amount = 10

      await aquariumLifeForms[0].pause(false) // marketplace opening

      await aquariumLifeForms[0].connect(mockPlayer).mintAQLF(amount)

      expect(
        await aquariumLifeForms[0].totalSupply(),
        'AQMA was not deployed'
      ).to.equal(1 + amount) // 1 was the previously minted NFT.

      expect(
        await aquariumLifeForms[0].balanceOf(mockPlayer.address),
        'AQMA #2 - #11 not delivered'
      ).to.equal(amount)
    })
  })

  describe(`${prefix} - Feed AQMA with PLANK`, () => {
    it(`Should burn ${feedAmount} PLANK and update AQMA battleCountSinceFed`, async () => {
      await plankton
        .connect(owner)
        .burnPlanktons(parsedDecimalValue(feedAmount))
      // TODO: mock API call to update the battleCountSinceFed

      expect(
        await plankton.totalSupply(),
        'Plankton wasnt burned'
      ).to.equal(parsedDecimalValue(planktonInitialSupply - feedAmount))
    })
  })
})
