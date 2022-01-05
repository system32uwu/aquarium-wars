require('dotenv').config()

const crypto = require("crypto");
const { readFileSync } = require("fs");
const { TOTAL_TOKENS, DEFAULT_IMAGES_PATH } = require(`${__dirname}/../collections/${process.env.BUILD_COLLECTION}/config`);

/** CALCULATE IMAGE HASH **/
(async () => {
  const imagesHashes = [];
  for (let tokenId = 0; tokenId < TOTAL_TOKENS; tokenId += 1) {
    const image = readFileSync(`${DEFAULT_IMAGES_PATH}/${tokenId}.png`);
    const hash = crypto.createHash("sha256").update(image).digest("hex");
    imagesHashes.push(hash);
    console.log(tokenId, hash);
  }
  const provenanceHash = crypto.createHash("sha256").update(imagesHashes.join("")).digest("hex");
  console.log(`Provenance hash: ${provenanceHash}`);
})();
