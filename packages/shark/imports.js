require('dotenv').config()

const collectionPath = `${__dirname}/collections/${process.env.BUILD_COLLECTION}`

const configPath = `${collectionPath}/config`

exports.collectionPath = collectionPath
exports.configPath = configPath