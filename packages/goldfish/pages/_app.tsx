import { AppProps } from 'next/app'
import Layout from '@components/Layout'
import { ChakraProvider } from '@chakra-ui/react'
import '@styles/globals.scss'
import 'react-toastify/dist/ReactToastify.css'

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default App
