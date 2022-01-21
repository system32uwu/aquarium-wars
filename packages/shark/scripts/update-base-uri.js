require('dotenv').config()

const { readFileSync, writeFileSync } = require("fs");
const { configPath } = require('../imports');
const {
  OUTPUT_PATH,
  TOTAL_TOKENS,
} = require(configPath);

exports.update = (URI) => {
  console.log(
    `new baseURI: ${URI}`
  );

  for (let tokenId = 1; tokenId < TOTAL_TOKENS; tokenId++) {
    const data = readFileSync(`${OUTPUT_PATH}/${tokenId}`);
    const json = {
      ...JSON.parse(data),
      image: `${URI}/${tokenId}.png`,
    };
    writeFileSync(
      `${OUTPUT_PATH}/${tokenId}`,
      JSON.stringify(json, null, 2)
    );
  }
  console.log(
    `SUCCESS! Images base URI in metadata files updated to: ${OUTPUT_PATH}`
  );
}