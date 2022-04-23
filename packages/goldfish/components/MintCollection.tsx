import { Wrap } from '@chakra-ui/layout'
import * as React from 'react'
import { useWalletStore } from '@lib/zustand'
import { deployedCollection } from '@util/NFTCollections'
import { buildContract } from '@util/web3'
import NFTCard from './NFTCard'

interface IProps {
  collectionData: deployedCollection
  abi: object
}

const MintCollection: React.FC<IProps> = ({ collectionData, abi }) => {
  // const { user } = useWalletStore()
  // const contract = buildContract(collectionData.address, abi)

  React.useEffect(() => {}, [])

  return (
    <Wrap justify="center">
      <NFTCard collectionData={collectionData} state="Mintable" abi={abi} />
    </Wrap>
  )
}

export default MintCollection
