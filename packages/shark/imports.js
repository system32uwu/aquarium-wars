const fs = require("fs");

const collectionPath = (BUILD_COLLECTION) => {
  require("dotenv").config();
  let _dir;

  if (fs.existsSync(`${__dirname}/collections/${_dir}/${BUILD_COLLECTION}`)) {
    _dir = BUILD_COLLECTION;
  } else {
    _dir = process.env.BUILD_COLLECTION;
  }

  return `${__dirname}/collections/${_dir}`;
};

const configPath = (BUILD_COLLECTION) => {
  return `${collectionPath(BUILD_COLLECTION)}/config`;
};

exports.collectionPath = collectionPath;

exports.configPath = configPath;
