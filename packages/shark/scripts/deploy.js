const fs = require("fs");
const path = require("path");
const { create, globSource } = require("ipfs-http-client");

const { configPath } = require("../imports");
const { OUTPUT_PATH } = require(configPath);
const { update } = require("./update-base-uri")

const gateway = "http://localhost:8080/ipfs"

const message = (cid) => `
# Deployed succesfully to IPFS!

To view the files uploaded, head over to ${gateway}/${cid}

To view a specific file, head over to ${gateway}/${cid}/file.png where file is the ID of the NFT. To view its metadata, remove the .png from the url

`;

(async () => {
  const ipfs = create(process.env.IPFS_API);

  const addedFiles = [];

  for await (const file of ipfs.addAll(globSource(OUTPUT_PATH, "**/*"), {
    fileImportConcurrency: 50,
    pin: true,
    wrapWithDirectory: true,
  })) {
    addedFiles.push({
      cid: file.cid.toString(),
      path: file.path,
      size: file.size,
    });
  }

  fs.writeFileSync(
    `${OUTPUT_PATH}/../ipfs-data.json`,
    JSON.stringify(addedFiles),
    "utf-8"
  );

  const dirCID = addedFiles[addedFiles.length - 1].cid;

  update(`${gateway}/${dirCID}`)

  fs.writeFileSync(
    `${OUTPUT_PATH}/../deploy.md`,
    message(dirCID),
    "utf-8"
  );
})();
