import { AppProps } from 'next/app'
import Layout from '../components/layout'
import '../styles/globals.scss'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
