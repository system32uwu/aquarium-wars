const fs = require('fs')

const collectionPath = (BUILD_COLLECTION = '') => {
  require('dotenv').config()
  let _dir

  if (!BUILD_COLLECTION) {
    BUILD_COLLECTION = process.argv[3]
  }

  console.log('COLLECTION IS:', BUILD_COLLECTION)
  console.log(`${__dirname}/collections/${BUILD_COLLECTION}`)

  if (fs.existsSync(`${__dirname}/collections/${BUILD_COLLECTION}`)) {
    _dir = BUILD_COLLECTION
  } else {
    _dir = process.env.BUILD_COLLECTION
  }

  return `${__dirname}/collections/${_dir}`
}

const configPath = (BUILD_COLLECTION) => {
  return `${collectionPath(BUILD_COLLECTION)}/config`
}

exports.collectionPath = collectionPath

exports.configPath = configPath
