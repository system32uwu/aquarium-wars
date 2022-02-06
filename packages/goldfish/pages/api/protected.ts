import { NextApiResponse } from 'next'
import withAuth, { IWithAuthReq } from '../../util/withAuth'

async function handler(req: IWithAuthReq, res: NextApiResponse) {
  res.json({ user: req.user })
}

export default withAuth(handler)
