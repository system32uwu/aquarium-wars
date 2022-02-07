import { Box } from '@chakra-ui/layout'
import { useEffect } from 'react'
import { useWalletStore } from '../../lib/zustand'
import Header from './header'

export default function Layout({ children }) {
  const { connect } = useWalletStore()

  useEffect(() => {
    ;(async () => {
      console.log('connecting')
      await connect(true)
    })() //try to connect wallet silently if the user has logged in previously so they don't have to click Connect button on every page refresh
  }, [])
  return (
    <>
      <Box
        backgroundImage="url('/bg1.jpg')"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        backgroundSize="cover"
        height="100vh"
      >
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </Box>
    </>
  )
}
