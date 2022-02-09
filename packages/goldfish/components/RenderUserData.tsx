import { Box } from '@chakra-ui/layout'
import * as React from 'react'
import { PublicUser } from '../lib/types'

interface IProps {
  user: PublicUser
  defaultMessage?: string
  toSeeContent?: string
  containerProps?: any
}

const RenderUserData: React.FC<IProps> = ({
  user,
  children,
  defaultMessage = 'Connect your wallet to see',
  toSeeContent = 'this content',
  containerProps,
}) => {
  return user?.username && user?.address ? (
    <Box {...containerProps}>{children}</Box>
  ) : (
    <Box>
      {defaultMessage} {toSeeContent}
    </Box>
  )
}

export default RenderUserData
