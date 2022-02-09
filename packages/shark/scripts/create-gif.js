const BUILD_COLLECTION = process.argv[2] || undefined
const { configPath } = require("../imports");
const makeConfig = require(configPath(BUILD_COLLECTION));
const {
  IMAGES_HEIGHT,
  IMAGES_WIDTH,
  TOTAL_TOKENS,
  OUTPUT_PATH_IMG,
  GIF_FRAMES
} = makeConfig(BUILD_COLLECTION);


const { writeFileSync } = require("fs");
const { createCanvas, loadImage } = require("canvas");
const GifEncoder = require("gif-encoder-2");

const canvas = createCanvas(IMAGES_WIDTH, IMAGES_HEIGHT);
const ctx = canvas.getContext("2d", { alpha: false });

const usedTokenIds = new Set();

(async () => {
  const gifEncoder = new GifEncoder(
    IMAGES_WIDTH,
    IMAGES_HEIGHT,
    "octree",
    false
  );

  const tokenIds = Array.from(Array(GIF_FRAMES)).map((_) => {
    let tokenId;
    do {
      tokenId = Math.floor(Math.random() * TOTAL_TOKENS) + 1;
    } while (usedTokenIds.has(tokenId));
    usedTokenIds.add(tokenId);
    return tokenId;
  });

  gifEncoder.setDelay(250);
  gifEncoder.setRepeat(0);
  gifEncoder.start();

  for (let tokenId of tokenIds) {
    const frame = await loadImage(`${OUTPUT_PATH_IMG}/${tokenId}.png`);
    ctx.drawImage(frame, 0, 0);
    gifEncoder.addFrame(ctx);
  }

  gifEncoder.finish();

  const buffer = gifEncoder.out.getData();
  writeFileSync(`${OUTPUT_PATH_IMG}/../preview.gif`, buffer);

  console.log(
    `Created GIF at ${OUTPUT_PATH_IMG}/../preview.gif width tokenIds: ${tokenIds.join(" ")}`
  );
})();
