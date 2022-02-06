import { prisma } from '../../lib/prisma'
import { User } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'

export interface IWithAuthReq extends NextApiRequest {
  user?: User
}

const withAuth = (handler) => async (req: IWithAuthReq, res: NextApiResponse) => {
  const cookies = new Cookies(req, res)

  const session = cookies.get('session')
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        address: session,
      },
    })

    req.user = user

    return handler(req, res)
  } else {
    return res.status(401).json({error: 'Unauthenticated'})
  }
}

export default withAuth