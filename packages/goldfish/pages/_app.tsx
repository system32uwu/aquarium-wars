import { AppProps } from 'next/app'
import Layout from '../components/Layout/layout'
import { ChakraProvider } from '@chakra-ui/react'
import { useWalletStore } from '../lib/zustand'
import { useEffect } from 'react'
import '../styles/globals.scss'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const { connect } = useWalletStore()

  useEffect(() => {
    connect(true) //try to connect wallet silently if the user has logged in previously so they don't have to click Connect button on every page refresh
  }, [])

  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default App
