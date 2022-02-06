import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@aquarium-wars/whale'
import { buildNonceMessage } from '../../../util/web3'
import { ethers } from 'ethers'

const walletApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { address, signature, nonce } = req.body

    const signerAddress = ethers.utils.verifyMessage(buildNonceMessage(nonce), signature)

    if (signerAddress !== address) {
      throw new Error('Wrong Signature')
    }

    const user = await prisma.user.findUnique({
      where: {
        address: address,
      },
    })

    if (user.nonce !== nonce) {
      throw new Error('Wrong Signature')
    } else {
      return res.status(200).json({ user })
    }
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export default walletApi
