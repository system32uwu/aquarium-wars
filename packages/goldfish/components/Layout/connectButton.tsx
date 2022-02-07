import { Button } from '@chakra-ui/button'
import { Icon } from '@chakra-ui/icons'
import * as React from 'react'
import { FaWallet } from 'react-icons/fa'
import { useWalletStore } from '../../lib/zustand'

interface IProps {}

const ConnectButton: React.FC<IProps> = () => {
  const { connect } = useWalletStore()
  return (
    <Button
      onClick={() => connect(false)}
      insetBlockEnd={0.5}
      rounded="md"
      size="lg"
      fontSize="xl"
      rightIcon={<Icon as={FaWallet} />}
      p={4}
    >
      Connect to wallet
    </Button>
  )
}

export default ConnectButton
