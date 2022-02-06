import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { buildNonceMessage } from '../../../util/web3'
import { ethers } from 'ethers'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'

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
      const token = jwt.sign(
        {
          user_metadata: user,
          role: 'authenticated',
        },
        process.env.JWT_SECRET,
        {
          audience: 'authenticated',
          expiresIn: '1d',
          subject: user.address,
        }
      )
      new Cookies(req, res).set('session', token, { httpOnly: true })

      return res.status(200).json({ user })
    }
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export default walletApi
