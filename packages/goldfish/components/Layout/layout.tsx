import { Box } from "@chakra-ui/layout"
import Header from "./header"

export default function Layout({ children }) {
  return (
    <>
      <Box
        backgroundImage="url('/bg1.jpg')"
        backgroundRepeat='no-repeat'
        backgroundPosition='center'
        backgroundAttachment="fixed"
        backgroundSize='cover'
        width='100vw'
        height='100vh'
      >
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </Box>

    </>
  )
}
