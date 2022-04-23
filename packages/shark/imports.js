const collectionPath = (BUILD_COLLECTION = '') => {
  require('dotenv').config()

  if (!BUILD_COLLECTION) {
    BUILD_COLLECTION = process.argv[3]
  }

  return `${__dirname}/collections/${BUILD_COLLECTION}`
}

const configPath = (BUILD_COLLECTION) => {
  return `${collectionPath(BUILD_COLLECTION)}/config`
}

exports.collectionPath = collectionPath

exports.configPath = configPath
