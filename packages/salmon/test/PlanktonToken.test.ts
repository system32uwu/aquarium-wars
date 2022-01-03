import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Plankton, Plankton__factory } from '../typechain'
import { parsedDecimalValue } from '../util'

const prefix = '[PLANK]'

describe(`${prefix} Plankton Token Contract`, () => {
  let Plankton: Plankton__factory
  let plankton: Plankton
  let initialSupply = 2 * 10 ** 9 // Print 2 billion PLANK

  let owner: SignerWithAddress
  let beneficiary: SignerWithAddress
  let mockPlayer: SignerWithAddress
  let mockPlayer2: SignerWithAddress
  let addrs: SignerWithAddress

  beforeEach(async () => {
    ;[
      owner,
      beneficiary,
      mockPlayer,
      mockPlayer2,
      addrs,
    ] = await ethers.getSigners()

    Plankton = await ethers.getContractFactory('Plankton')
    plankton = await Plankton.deploy(initialSupply, beneficiary.address)

    await plankton.deployed()
  })

  describe(`${prefix} Deployment`, () => {
    it('Should return the beneficiary balance once deployed', async () => {
      const beneficiaryBalance = await plankton.balanceOf(beneficiary.address)

      expect(
        beneficiaryBalance,
        'beneficiary did not receive initialSupply',
      ).to.equal(parsedDecimalValue(initialSupply))
    })
  })

  describe('Transfer PLANK', () => {
    it('Should transfer PLANK from beneficiary to mockPlayer account', async () => {
      const transferAmmount = 500000 // 500,000 PLANK

      await plankton
        .connect(beneficiary)
        .transfer(mockPlayer.address, parsedDecimalValue(transferAmmount))

      const mockPlayerBalance = await plankton.balanceOf(mockPlayer.address)
      const beneficiaryBalance = await plankton.balanceOf(beneficiary.address)

      expect(mockPlayerBalance, 'mockPlayer balance is not correct').to.equal(
        parsedDecimalValue(transferAmmount),
      )

      expect(beneficiaryBalance).to.equal(
        parsedDecimalValue(initialSupply).toBigInt() -
          parsedDecimalValue(transferAmmount).toBigInt(),
      )
    })
  })

  describe('Mint and burn PLANK', () => {
    it('Should mint the specified amount of PLANK and send it to the specified address', async () => {
      const plankToMint = 1540720 // print 1,540,720 PLANK

      await plankton.mintPlanktons(
        mockPlayer2.address,
        parsedDecimalValue(plankToMint),
      )

      expect(
        await plankton.totalSupply(),
        'plankton totalSupply is not what it should be',
      ).to.equal(parsedDecimalValue(initialSupply + plankToMint))
    })

    it('Should burn the specified amount of PLANK from the specified address', async () => {
      const plankToBurn = 500000 // burn 500,000 PLANK

      await plankton
        .connect(beneficiary)
        .burnPlanktons(parsedDecimalValue(plankToBurn))

      expect(
        await plankton.totalSupply(),
        'plankton totalSupply is not what it should be',
      ).to.equal(parsedDecimalValue(initialSupply - plankToBurn))
    })
  })
})
