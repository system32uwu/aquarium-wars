import { Wrap, WrapItem } from '@chakra-ui/layout'
import { ethers } from 'ethers'
import * as React from 'react'
import { useWalletStore } from '@lib/zustand'
import { deployedCollection } from '@util/NFTCollections'
import { tokensOfOwner } from '@util/tokensOfOwner'
import NFTCard from './NFTCard'
import { buildContract } from '@util/web3'

interface IProps {
  collectionData: deployedCollection
  abi: object
}

const NFTCollection: React.FC<IProps> = ({ collectionData, abi }) => {
  const [tokens, setTokens] = React.useState<string[]>([])
  const { user } = useWalletStore()
  const contract = buildContract(collectionData.address, abi)
  const filter = contract.filters.Transfer(null, user?.address)

  React.useEffect(() => {
    ;(async () => {
      if (user) {
        const _tokens = await tokensOfOwner(contract, user?.address)
        setTokens(_tokens)

        contract.on(filter, (from, to, tokenId, event) => {
          tokenId = ethers.utils.formatUnits(tokenId.toString(), 'wei')
          setTokens((prevTokens) =>
            !prevTokens.includes(tokenId) ? [...prevTokens, tokenId] : prevTokens
          )
        })
      }
    })()

    const cleanUp = () => {
      contract.removeAllListeners()
    }

    return cleanUp
  }, [user])

  return (
    <Wrap justify="center">
      {tokens.map((nft) => (
        <WrapItem key={nft}>
          <NFTCard
            tokenId={parseInt(nft)}
            collectionData={collectionData}
            state="Owned"
            abi={abi}
          />
        </WrapItem>
      ))}
    </Wrap>
  )
}

export default NFTCollection
