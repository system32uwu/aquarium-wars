import { prisma } from '../lib/prisma'
import { User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export interface IWithAuthReq extends NextApiRequest {
  user?: User
}

const withAuth = (handler) => async (req: IWithAuthReq, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        username: session.user.name,
      },
    })

    req.user = user

    return handler(req, res)
  } else {
    return res.status(401)
  }
}

export default withAuth
