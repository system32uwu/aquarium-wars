import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { nonce } from '../../../util/web3'

const nonceApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.body
  const _nonce = nonce()

  let user = await prisma.user.findUnique({
    where: {
      address: address,
    },
  })

  if (!user) {
    // create new user record + nonce

    user = await prisma.user.create({
      data: {
        address: address,
        nonce: _nonce,
      },
    })
  } else {
    // new nonce
    await prisma.user.update({
      where: {
        address: address,
      },
      data: {
        nonce: _nonce,
      },
    })
  }

  return res.json({ nonce: _nonce })
}

export default nonceApi
