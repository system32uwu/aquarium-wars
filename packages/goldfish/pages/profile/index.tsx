import * as React from 'react'
import { Box, Container, HStack, Link } from '@chakra-ui/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import { useWalletStore } from '@lib/zustand'
import { withAuthView } from '@middleware/withAuth'
import RenderUserData from '@components/RenderUserData'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { deployedCollection, getCollections } from '@util/NFTCollections'
import AQLF from '@contracts/abis/AquariumLifeForm.json'
import NFTCollection from '@components/NFTCollection'
import { Input } from '@chakra-ui/input'
import { AiFillCheckCircle } from 'react-icons/ai'
import { IconButton } from '@chakra-ui/button'

interface IProps {
  collections: deployedCollection[]
}

const Profile: React.FC<IProps> = ({ collections }) => {
  const { user, setUsername } = useWalletStore()

  const [username, setUsernameLocal] = React.useState<string>(user?.username || '')

  const inputEl = React.useRef(null)

  const onEdit = () => {
    inputEl.current.focus()
  }

  React.useEffect(() => {
    user?.username && setUsernameLocal(user?.username)
  }, [user])

  return (
    <Box justifyContent="center" flex={1} width="full" mt={2} justifyItems="center">
      <Box w="full" p={2} justifyContent="center">
        <RenderUserData user={user} toSeeContent="your profile">
          <Container textAlign="center" rounded="full" p={2}>
            <HStack align="center" w="full">
              <Input
                color="white"
                placeholder="A cool username"
                value={username}
                onChange={(ev) => setUsernameLocal(ev.target.value)}
                ref={inputEl}
                w="full"
                bgColor="blackAlpha.400"
                textAlign="center"
                fontWeight="bold"
              />
              {username === user?.username ? (
                // <EditIcon onClick={onEdit} />
                <IconButton aria-label="" onClick={onEdit} icon={<EditIcon />} bg="transparent" />
              ) : (
                <IconButton
                  aria-label=""
                  onClick={() => setUsername(inputEl.current.value)}
                  icon={<AiFillCheckCircle />}
                  bg="transparent"
                />
              )}
            </HStack>
            <span className="text-gray-100 font-semibold italic">
              <Link href={`https://etherscan.io/address/${user?.address}`} isExternal>
                ({user?.address}) <ExternalLinkIcon mx="2px" />
              </Link>
            </span>
          </Container>
        </RenderUserData>
      </Box>
      <Box p={4} mx={10} bgColor="cyan.50" rounded="3xl">
        <Tabs h="max">
          <TabList alignContent="center" justifyContent="center" justifyItems="center">
            <Tab>Owned Aquarium Life Forms</Tab>
            <Tab>Battle History</Tab>
            <Tab>Player Stats</Tab>
          </TabList>

          <TabPanels h="max">
            <TabPanel h="max">
              {/* <p>Show all the collections of NFTs in accordions with the NFTs that the user owns</p> */}
              {collections.map((c) => (
                <Box key={c.address}>
                  <h2>
                    {c.name} ({c.symbol})
                  </h2>
                  <Box pb={4}>
                    <NFTCollection collectionData={c} abi={AQLF} />
                  </Box>
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              <p>Show all the battles in which the user fought</p>
            </TabPanel>
            <TabPanel>
              <p>Most used AQLF, win/lose %, total Plankton fed to AQLFs, Highest win streak</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withAuthView(async (_) => {
  const collections = await getCollections()
  return {
    props: {
      collections,
    },
  }
})

export default Profile
