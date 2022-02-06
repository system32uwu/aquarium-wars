import { NextApiResponse } from 'next'
import withAuth, { IWithAuthReq } from '../../../middleware/api/withAuth'

const meApi = async (req: IWithAuthReq, res: NextApiResponse) => {
  return res.status(200).json({ user: req.user })
}

export default withAuth(meApi)
