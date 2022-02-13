import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import * as React from 'react'
import MintCollection from '../../components/MintCollection'
import NFTCollection from '../../components/NFTCollection'
import AQLF from '../../contracts/AquariumLifeForm.sol/AquariumLifeForm.json'
import { withAuthView } from '../../middleware/withAuth'
import { deployedCollection, getCollections } from '../../util/NFTCollections'

interface IProps {
    collections: deployedCollection[]
}

const Index: React.FC<IProps> = ({ collections }) => {
    return <Box bgColor="twitter.300" rounded="xl" p={10} mx={12} mt={8}>
        <Tabs h="max">
            <TabList alignContent="center" justifyContent="center" justifyItems="center">
                <Tab>Mint</Tab>
                <Tab>Trade</Tab>
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
                                <MintCollection collectionData={c} abi={AQLF.abi} />
                            </Box>
                        </Box>
                    ))}
                </TabPanel>
                <TabPanel>
                    <p>Show open orders</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
}


export const getServerSideProps = withAuthView(async (_) => {
    const collections = await getCollections()
    return {
        props: {
            collections,
        },
    }
})

export default Index
