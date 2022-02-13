import {
  Flex,
  Box,
  Image,
  useColorModeValue,
  Badge,
  Circle,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  useDisclosure,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  useToast,
} from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { useWalletStore } from '../lib/zustand'
import { deployedCollection } from '../util/NFTCollections'
import { buildContract } from '../util/tokensOfOwner'

interface RatingProps {
  rating: number
  numReviews: number
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
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

interface MintModalProps {
  collectionData: deployedCollection,
  abi: object
}

const MintModal: React.FC<MintModalProps> = ({ collectionData, abi }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [amount, setAmount] = React.useState(1)
  const { instance } = useWalletStore()
  const toast = useToast()

  const format = (val) => `Ξ ` + val
  const price = parseFloat(ethers.utils.formatEther(BigNumber.from(collectionData.price.hex).toString()))

  const onMint = async (amount: number) => {
    const contract = buildContract(collectionData.address, abi)

    const total = amount * Math.round(price * 100) / 100

    const signer = contract.connect(instance.provider.getSigner())

    const nftTx = await signer.mintAQLF(amount, {
      value: ethers.utils.parseEther(total.toString()),
    })

    const tx = await nftTx.wait()

    let event = tx.events[0]
    let value = event.args[2]

    console.log(event, value)
    // TODO: show a status message "NFTs minted succesfully" 
    toast({
      title: 'NFT(s) minted succesfully.',
      description: <a href="/profile">Head to your profile to see the minted NFTs!</a>,
      status: 'success',
      duration: 9000,
      isClosable: true
    })
  }

  return (
    <>
      <Button onClick={onOpen}>Mint</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint {collectionData.symbol}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <NumberInput
              onChange={(valueString) => setAmount(parseInt(valueString))}
              value={amount}
              max={20}
              letterSpacing={4}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Box p={2}>
              Total: {format(amount * Math.round(price * 100) / 100)}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => onMint(amount || 1)}>
              Mint
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export type NFTState = "Mintable" | "OnSale" | "Owned"

interface INFTCardProps {
  tokenId?: number
  collectionData: deployedCollection
  abi: object
  state: NFTState
}

const NFTCard: React.FC<INFTCardProps> = ({ tokenId, collectionData, state, abi }) => {
  const [metadata, setMetadata] = useState<any | null>(null)

  useEffect(() => {
    ; (async () => {
      if (state === "OnSale" || state === "Owned") {
        const _metadataRes = await fetch(
          `${collectionData.baseUri.replace('ipfs:///', 'http://localhost:8080/ipfs/')}/${tokenId}`
        )
        const _metadata = await _metadataRes.json()
        setMetadata(_metadata)
      } else {
        setMetadata({
          "tokenId": "?",
          "name": `${collectionData.name} #?`,
          "image": `/previews/${collectionData.symbol}.gif`
        })
      }
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
            {
              state !== "Owned" ? <Box
                label={state === "Mintable" ? "Mint" : "Buy"}
                bg="white"
                placement={'top'}
                color={'gray.800'}
                fontSize={'1.2em'}
              >
                <MintModal collectionData={collectionData} abi={abi} />
              </Box> : null
            }
          </Flex>
          {
            state !== "Mintable" ? <Flex justifyContent="space-between" alignContent="center">
              <Rating rating={3} numReviews={4} />
            </Flex> : null
          }
        </Box>
      </Box>
    </Flex>
  )
}

export default NFTCard
