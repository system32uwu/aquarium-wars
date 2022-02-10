import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Badge,
  Circle,
  chakra,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { FiShoppingCart } from "react-icons/fi"
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { deployedCollection } from '../util/NFTCollections'

interface RatingProps {
  rating: number
  numReviews: number
}

const Rating: React.FC<RatingProps> = ({ rating, numReviews }) => {
  return (
    <Box d="flex" alignItems="center">
      {Array(5)
        .fill('')
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2
          if (roundedRating - i >= 1) {
            return (
              <BsStarFill
                key={i}
                style={{ marginLeft: '1' }}
                color={i < rating ? 'teal.500' : 'gray.300'}
              />
            )
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: '1' }} />
          }
          return <BsStar key={i} style={{ marginLeft: '1' }} />
        })}
    </Box>
  )
}

interface INFTCardProps {
  tokenId: number
  collectionData: deployedCollection
}

const NFTCard: React.FC<INFTCardProps> = ({ tokenId, collectionData }) => {
  const [metadata, setMetadata] = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      const _metadataRes = await fetch(
        `${collectionData.baseUri.replace('ipfs:///', 'http://localhost:8080/ipfs/')}/${tokenId}`
      )
      const _metadata = await _metadataRes.json()
      console.log(_metadata)
      setMetadata(_metadata)
    })()
  }, [])

  return (
    <Flex p={5} alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="min"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        <Circle size="10px" position="absolute" top={4} right={4} bg="red.200">
          <Box d="flex" alignItems="baseline">
            <Badge letterSpacing={1} rounded="full" px="2" py="1" fontSize="0.8em" colorScheme="red">
              #{metadata?.tokenId}
            </Badge>
          </Box>
        </Circle>

        <Image src={metadata?.image} alt={`Picture of ${metadata?.name}`} roundedTop="lg" />

        <Box p={6}>
          <Flex mt={1} justifyContent="space-between" alignContent="center">
            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
              {metadata?.name}
            </Box>
            <Box ml={4} fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
              <Box as="span" color={'gray.600'} fontSize="lg">
                Ξ
              </Box>
              <Box as="span" ml={0.5}>
                {ethers.utils.formatEther(BigNumber.from(collectionData.price.hex).toString())}
              </Box>
            </Box>
            {/* <Tooltip
              label="Add to cart"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}
            >
              <chakra.a href={'#'} display={'flex'}>
                <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
              </chakra.a>
            </Tooltip> */}
          </Flex>
          <Flex justifyContent="space-between" alignContent="center">
            <Rating rating={3} numReviews={4} />
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

export default NFTCard
