import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'

const logoutApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res)

  cookies.set('session')
  res.send(200)
}

export default logoutApi
