require('dotenv').config()

const { readFileSync, writeFileSync } = require("fs");
const {
  DEFAULT_METADATA_PATH,
  IMAGES_BASE_URI,
  TOTAL_TOKENS,
} = require(`${__dirname}/../collections/${process.env.BUILD_COLLECTION}/config`);

/** UPDATE BASE URI SCRIPT **/
(() => {
  for (let tokenId = 1; tokenId < TOTAL_TOKENS; tokenId++) {
    const data = readFileSync(`${DEFAULT_METADATA_PATH}/${tokenId}.json`);
    const json = {
      ...JSON.parse(data),
      image: `${IMAGES_BASE_URI}/${tokenId}.png`,
    };
    writeFileSync(
      `${DEFAULT_METADATA_PATH}/${tokenId}.json`,
      JSON.stringify(json, null, 2)
    );
  }
  console.log(
    `SUCCESS! Images base URI in metadata files updated to: ${DEFAULT_METADATA_PATH}`
  );
})();
