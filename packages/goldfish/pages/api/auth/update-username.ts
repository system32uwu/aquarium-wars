import { NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { IWithAuthReq, withAuthApi } from '../../../middleware/withAuth'

const updateUsernameApi = async (req: IWithAuthReq, res: NextApiResponse) => {
  const { username } = req.body

  const user = await prisma.user.update({
    where: {
      address: req.user.address,
    },
    data: {
      username: username,
    },
    select: {
      address: true,
      username: true,
    },
  })

  return res.json({ user })
}

export default withAuthApi(updateUsernameApi)
