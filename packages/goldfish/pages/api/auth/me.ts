import { NextApiResponse } from 'next'
import { withAuthApi, IWithAuthReq } from '../../../middleware/withAuth'

const meApi = async (req: IWithAuthReq, res: NextApiResponse) => {
  return res.status(200).json({ user: req.user })
}

export default withAuthApi(meApi)
