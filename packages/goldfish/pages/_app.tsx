import { AppProps } from 'next/app'
import Layout from '../components/Layout/layout'
import '../styles/globals.scss'
import { ChakraProvider } from '@chakra-ui/react'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>

  )
}

export default App
