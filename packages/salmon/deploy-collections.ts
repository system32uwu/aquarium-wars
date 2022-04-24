import { exec } from 'child_process'
import { readdir, readFile } from 'fs-extra'
import { join } from 'path'

// read all files in collections
// run yarn deploy-nft ${f} where f is the json data of the created collection that comes from shark

const deployedCurrenciesDir = `${__dirname}/../goldfish/contracts/deployedCurrencies`

const main = async () => {
  const dirname = `${process.cwd()}/collections`
  const fileNames = await readdir(dirname)
  console.log('collections are: ', fileNames)

  const plank = require(join(deployedCurrenciesDir, 'PLANK.json'))

  for (const fileName of fileNames) {
    const file = await readFile(`${dirname}/${fileName}`, 'utf8')
    let data = JSON.parse(file)

    let args: string = ''

    Object.values(data).map((arg) => {
      args += `"${arg}" `
    })

    args += plank.address

    const cmd = `yarn deploy-nft ${args}`

    console.log('deploying nft with the following command:\n', cmd)

    exec(cmd, (error, stdout, stederr) => {
      if (error) {
        console.log('[deploy-collection] - Error:', error)
      }

      if (stederr) {
        console.log('[deploy-collection] - Error:', error)
      }

      if (stdout) console.log('[deploy-collection] - Status:', stdout)
    })
  }
}

main()
  .then(() =>
    console.log('NFT collection deployed successfully to blockchain')
  )
  .catch((e) =>
    console.log('An error ocurred while deploying to blockchain:', e)
  )
