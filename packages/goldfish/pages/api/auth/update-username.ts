import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import Cookies from 'cookies'

const updateUsernameApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res)
  const address = cookies.get('session')
  const { username } = req.body

  const user = await prisma.user.update({
    where: {
      address: address,
    },
    data: {
      username: username,
    },
  })

  return res.json({ user })
}

export default updateUsernameApi
