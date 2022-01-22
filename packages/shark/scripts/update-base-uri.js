const BUILD_COLLECTION = process.argv[2] || undefined;
const { configPath } = require("../imports");
const makeConfig = require(configPath(BUILD_COLLECTION));
const { OUTPUT_PATH_META, TOTAL_TOKENS } = makeConfig(BUILD_COLLECTION);

const { readFile, writeFile } = require("fs").promises;

exports.update = async (URI) => {
  console.log(`new baseURI: ${URI}`);

  for (let tokenId = 1; tokenId <= TOTAL_TOKENS; tokenId++) {
    const data = await readFile(`${OUTPUT_PATH_META}/${tokenId}`);
    const json = {
      ...JSON.parse(data),
      image: `${URI}/${tokenId}.png`,
    };
    await writeFile(
      `${OUTPUT_PATH_META}/${tokenId}`,
      JSON.stringify(json, null, 2)
    );
  }

  console.log(
    `SUCCESS! Images base URI in metadata files updated to: ${OUTPUT_PATH_META}`
  );
};
