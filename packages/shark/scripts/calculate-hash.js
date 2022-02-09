const BUILD_COLLECTION = process.argv[2] || undefined

const { configPath } = require('../imports')
const makeConfig = require(configPath(BUILD_COLLECTION))
const { TOTAL_TOKENS, OUTPUT_PATH_IMG } = makeConfig(BUILD_COLLECTION)

const crypto = require('crypto')
const { readFileSync } = require('fs')

;(async () => {
  const imagesHashes = []
  for (let tokenId = 1; tokenId <= TOTAL_TOKENS; tokenId++) {
    const image = readFileSync(`${OUTPUT_PATH_IMG}/${tokenId}.png`)
    const hash = crypto.createHash('sha256').update(image).digest('hex')
    imagesHashes.push(hash)
    console.log(tokenId, hash)
  }
  const provenanceHash = crypto.createHash('sha256').update(imagesHashes.join('')).digest('hex')
  console.log(`Provenance hash: ${provenanceHash}`)
})()
