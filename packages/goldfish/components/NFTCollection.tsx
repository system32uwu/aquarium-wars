import { Box } from '@chakra-ui/layout'
import * as React from 'react'
import { useWalletStore } from '../lib/zustand'
import { deployedCollection } from '../util/NFTCollections'
import { tokensOfOwner } from '../util/tokensOfOwner'
import NFTCard from './NFTCard'

interface IProps {
  collectionData: deployedCollection
  abi: object
}

const NFTCollection: React.FC<IProps> = ({ collectionData, abi }) => {
  const [tokens, setTokens] = React.useState<string[]>([])
  const { user } = useWalletStore()

  React.useEffect(() => {
    ;(async () => {
      if (user) {
        const _tokens = await tokensOfOwner(collectionData.address, abi, user?.address)
        console.log('tokens', _tokens)
        setTokens(_tokens)
      }
    })()
  }, [user])

  return (
    <Box>
      {tokens.map((nft) => (
        <NFTCard tokenId={parseInt(nft)} collectionData={collectionData} />
      ))}
    </Box>
  )
}

export default NFTCollection
