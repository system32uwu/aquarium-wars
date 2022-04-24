import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  AquariumLifeForm,
  AquariumLifeForm__factory,
  Plankton,
  Plankton__factory,
} from '../typechain'

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

    Plankton = await ethers.getContractFactory('Plankton')
    plankton = await Plankton.deploy(planktonInitialSupply, owner.address)

    await plankton.deployed()

    AquariumLifeForm = await ethers.getContractFactory('AquariumLifeForm')

    let AQMA = await AquariumLifeForm.deploy(
      'http://127.0.0.1/api/aqlf/AQMA', // uri
      'Mutant Anchovies', // name
      'AQMA', // symbol
      ethers.utils.parseUnits('0.1', 'ether'), // mint cost
      "20", // max to batch mint
      "100", // reserved for giveaways
      "10000", // 10k AQMA
      plankton.address,
      "100"
    )

    let AQRS = await AquariumLifeForm.deploy(
      'http://127.0.0.1/api/aqlf/aqrs', // uri
      'Robo Sharkies', // name
      'AQRS', // symbol
      ethers.utils.parseUnits('0.5', 'ether'), // mint cost
      "20", // max to batch mint
      "10", // reserved for giveaways
      "7500", // 10k AQMA
      plankton.address,
      "150"
    )

    aquariumLifeForms.push(AQMA)
    aquariumLifeForms.push(AQRS)

    await AQMA.deployed()
    await AQRS.deployed()

  })

  describe(`${prefix} - Mint AQMA`, () => {
    it('Should mint 20 NFTs', async () => {
      let amount = 20
      let unitCost = await aquariumLifeForms[0].price()

      const total =
        parseFloat(ethers.utils.formatEther(unitCost.toString())) * amount

      await aquariumLifeForms[0].pause(false) // marketplace opening

      await aquariumLifeForms[0].connect(mockPlayer).mintAQLF(amount, {
        value: ethers.utils.parseUnits(total.toString(), 'ether'),
      })

      expect(
        await aquariumLifeForms[0].totalSupply(),
        'AQMA was not deployed'
      ).to.equal(amount)

      expect(
        await aquariumLifeForms[0].balanceOf(mockPlayer.address),
        'AQMA #1 - #20 werent delivered'
      ).to.equal(amount)
    })
  })
})
