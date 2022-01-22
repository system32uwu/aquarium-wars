const fs = require("fs");

// set env variable to the given collection name via argv
const BUILD_COLLECTION = process.env.BUILD_COLLECTION || process.argv[2]

// create collection using the argv name:
// create collections/COLLECTION_NAME
// create collections/COLLECTION_NAME/config.js

const root = __dirname + "/..";

const collectionDIR = `${root}/collections/${BUILD_COLLECTION}`;

fs.mkdirSync(`${collectionDIR}/traits`, {recursive: true});

const genConfig = `const makeConfig = (BUILD_COLLECTION) => {
  require('dotenv').config()

  if (!BUILD_COLLECTION) {
    BUILD_COLLECTION = process.env.BUILD_COLLECTION;
  }

  const baseOutput = \`\${__dirname}/output/\${BUILD_COLLECTION}\`;

  const config = {
    OUTPUT_PATH: \`\${baseOutput}\`,
    OUTPUT_PATH_IMG: \`\${baseOutput}/images\`,
    OUTPUT_PATH_META: \`\${baseOutput}/metadata\`,
  
    // Update the variables below according to the collection you want to generate, let the ones aboves untouched unless you know what you're doing
    TOKEN_NAME_PREFIX: "${BUILD_COLLECTION} #",
    TOKEN_DESCRIPTION: "This NFT Belongs to the ${BUILD_COLLECTION} collection.",
    TOTAL_TOKENS: 100,
  
    IMAGES_HEIGHT: 1080,
    IMAGES_WIDTH: 1080,
  
    GATEWAY: "http://localhost:8080/ipfs", // leave blank if you don't have a dedicated gateway
  
    // Set these two if you want them to be uploaded to a centralized service (not IPFS)
    IMAGES_BASE_URI: "", // https://myserver.com/collection1
    UPLOAD_API_ENDPOINT: "", // https://myserver.com/api/v1/upload-collection
  
    GIF_FRAMES: 36,
  };
  
  config.ORDERED_TRAITS_LIST = [
    {
      type: "Background",
      options: [
        {
          image: __dirname + "/traits/00-Background/Diamond.png", // Recommended format (always leave /traits, but change the "layer" and the final file)
          value: "Diamond",
          weight: 1,
        },
      ],
    },
  ];
}

module.exports = makeConfig;

`;

fs.writeFileSync(`${collectionDIR}/config.js`, genConfig);
