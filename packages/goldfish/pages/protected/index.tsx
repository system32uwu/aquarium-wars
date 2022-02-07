import * as React from 'react'
import { useWalletStore } from '../../lib/zustand'
import { withAuthView } from '../../middleware/withAuth'

interface IProps {}

const Index: React.FC<IProps> = ({}) => {
  const { user } = useWalletStore()
  return user ? (
    <div className="text-white">Authenticated {user.username}</div>
  ) : (
    <div className="text-white">Re-connect wallet!</div>
  )
}

// don't allow users that are not logged in to enter this page
export const getServerSideProps = withAuthView((_) => {
  return {
    props: {},
  }
})

export default Index
