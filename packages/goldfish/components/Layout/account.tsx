import * as React from 'react'

import { Button } from '@chakra-ui/button'
import { Stack } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/menu'

import { useDisclosure, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/color-mode'

import { ChevronDownIcon, Icon } from '@chakra-ui/icons'
import { FaWallet, FaUserCircle } from 'react-icons/fa'
import { MdOutlineLogout } from 'react-icons/md'

import { useWalletStore } from '../../lib/zustand'
import Link from 'next/link'

interface IProps {}

const Account: React.FC<IProps> = ({}) => {
  const { instance, disconnect } = useWalletStore()
  const [address, setAddress] = React.useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
    instance.signer.getAddress().then((address) => setAddress(address))
  }, [instance])

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        as={Button}
        insetBlockEnd={0.5}
        rounded="md"
        size="lg"
        fontSize="lg"
        leftIcon={<Icon as={FaWallet} />}
        p={4}
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        {address.replace(/(.{13})..+/, '$1…')}
      </MenuButton>
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        <MenuItem p={2}>
          <Link href="/profile">
            <Stack ml={2} flex={1} flexDirection="row">
              <Icon as={FaUserCircle} pr={2} fontSize={42} />
              <Text>Profile</Text>
            </Stack>
          </Link>
        </MenuItem>
        <MenuItem onClick={() => disconnect()} p={2}>
          <Stack ml={2} flex={1} flexDirection="row">
            <Icon as={MdOutlineLogout} pr={2} fontSize={42} />
            <Text>Log out</Text>
          </Stack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Account
