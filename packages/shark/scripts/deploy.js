const BUILD_COLLECTION = process.argv[2] || undefined

const { configPath } = require('../imports')
const makeConfig = require(configPath(BUILD_COLLECTION))
const {
  IMAGES_BASE_URI,
  OUTPUT_PATH,
  OUTPUT_PATH_META,
  OUTPUT_PATH_IMG,
  GATEWAY,
  COLLECTION_NAME,
  COLLECTION_SYMBOL,
  TOTAL_TOKENS,
  RESERVED_TOKENS,
  MINT_PRICE,
  MAX_MINT,
  FEED_FEE
} = makeConfig(BUILD_COLLECTION)

const _GATEWAY = GATEWAY || 'https://ipfs.io/ipfs'

const fs = require('fs')

const { create, globSource } = require('ipfs-http-client')

const { update } = require('./update-base-uri')

const deployResult = (imgCID, metaCID) => `
# Deployed succesfully to IPFS!

## Images

To view the image files uploaded, head over to ${_GATEWAY}/${imgCID}

To view a specific image file, head over to ${_GATEWAY}/${imgCID}/{ID}.png where ID is the ID of the NFT.

## Metadata

To view the metadata files uploaded, head over to ${_GATEWAY}/${metaCID}

To view a specific metadata file, head over to ${_GATEWAY}/${metaCID}/ID where ID is the ID of the NFT.

`

;(async () => {
  if (!IMAGES_BASE_URI.startsWith('http')) {
    // use ipfs
    const ipfs = create(process.env.IPFS_API)

    const addedImages = []

    // upload images first
    for await (const file of ipfs.addAll(globSource(OUTPUT_PATH_IMG, '**/*'), {
      fileImportConcurrency: 50,
      pin: true,
      wrapWithDirectory: true,
    })) {
      addedImages.push({
        cid: file.cid.toString(),
        path: file.path,
        size: file.size,
      })
    }

    fs.writeFileSync(
      `${OUTPUT_PATH_IMG}/../ipfs-data-images.json`,
      JSON.stringify(addedImages),
      'utf-8'
    )

    const imagesDirCID = addedImages[addedImages.length - 1].cid

    const addedMetaFiles = []

    await update(`${_GATEWAY}/${imagesDirCID}`) // update URI of metadata

    // upload metadata with updated image URI
    for await (const file of ipfs.addAll(globSource(OUTPUT_PATH_META, '**/*'), {
      fileImportConcurrency: 50,
      pin: true,
      wrapWithDirectory: true,
    })) {
      addedMetaFiles.push({
        cid: file.cid.toString(),
        path: file.path,
        size: file.size,
      })
    }

    fs.writeFileSync(
      `${OUTPUT_PATH_META}/../ipfs-data-meta.json`,
      JSON.stringify(addedMetaFiles),
      'utf-8'
    )

    const metadataDirCID = addedMetaFiles[addedMetaFiles.length - 1].cid

    fs.writeFileSync(
      `${OUTPUT_PATH}/../deploy.md`,
      deployResult(imagesDirCID, metadataDirCID),
      'utf-8'
    )

    console.log(fs.readFileSync(`${OUTPUT_PATH}/../deploy.md`, { encoding: 'utf-8' }))

    fs.writeFileSync(
      `${__dirname}/../../salmon/collections/${COLLECTION_SYMBOL}.json`,
      JSON.stringify(
        {
          baseUri: `ipfs:///${metadataDirCID}`,
          name: COLLECTION_NAME,
          symbol: COLLECTION_SYMBOL,
          price: MINT_PRICE,
          maxmint: MAX_MINT,
          reserved: RESERVED_TOKENS,
          supply: TOTAL_TOKENS,
          feedFee: FEED_FEE
        },
        null,
        2
      ),
      'utf-8'
    )

    console.log(`Successfully deployed! Read ${OUTPUT_PATH}/deploy.md to read more`)
  } else {
    // TODO: Upload to centralized server
  }
})()
