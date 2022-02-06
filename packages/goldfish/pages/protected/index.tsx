import * as React from 'react'
import withAuth from '../../util/withAuth'

interface IProps {}

const Index: React.FC<IProps> = ({}) => {
  return <div className="text-white">Protected Route!!!!!!!!!!!!!!!!!!!!!!!!</div>
}

export const getServerSideProps = withAuth(async ({ req }) => {
  const { user } = req

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
})

export default Index
