import * as React from 'react'
import { Box, Container, Link, Text } from '@chakra-ui/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import { useWalletStore } from '../../lib/zustand'
import { withAuthView } from '../../middleware/withAuth'
import RenderUserData from '../../components/RenderUserData'
import { EditIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'

interface IProps {}

const Profile: React.FC<IProps> = ({}) => {
  const { user } = useWalletStore()
  return (
    <Box justifyContent="center" flex={1} width="full" mt={2} justifyItems="center">
      <Box w="full" p={2} justifyContent="center">
        <RenderUserData user={user} toSeeContent="your profile">
          <Container textAlign="center" rounded="full" p={2}>
            <Box>
              <Input
                color="white"
                variant="unstyled"
                placeholder="A cool username"
                value={user?.username}
              />
              <EditIcon></EditIcon>
            </Box>
            <span className="text-gray-100 font-thin italic">
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
              <p>Show all the collections of NFTs in accordions with the NFTs that the user owns</p>
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

export const getServerSideProps = withAuthView((_) => {
  return {
    props: {},
  }
})

export default Profile
