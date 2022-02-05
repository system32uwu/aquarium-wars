import { Button } from '@chakra-ui/button'
import { Icon } from '@chakra-ui/icons'
import * as React from 'react'
import { FaWallet } from 'react-icons/fa'
import { useWalletStore } from '../../store/web3'

interface IProps {}

const Account: React.FC<IProps> = ({}) => {
  const { instance, disconnect } = useWalletStore()
  const [address, setAddress] = React.useState<string>('')

  React.useEffect(() => {
    instance.signer.getAddress().then((address) => setAddress(address))
  }, [instance])

  return (
    <Button
      onClick={() => disconnect()}
      insetBlockEnd={0.5}
      rounded="md"
      size="lg"
      fontSize="xl"
      leftIcon={<Icon as={FaWallet} />}
      p={4}
    >
      {address.replace(/(.{13})..+/, '$1…')}
    </Button>
  )
}

export default Account
