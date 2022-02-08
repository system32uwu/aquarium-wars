import { exec } from 'child_process'
import { readdir, readFile } from 'fs-extra'

// read all files in collections-data
// run yarn deploy-nft ${f} where f is the json data of the created collection that comes from shark

const main = async () => {
  const dirname = `${process.cwd()}/collections-data`
  const fileNames = await readdir(dirname)

  for (const fileName of fileNames) {
    const file = await readFile(`${dirname}/${fileName}`, 'utf8')
    let data = JSON.parse(file)

    let args: string = ''

    Object.values(data).map((arg) => {
      args += `"${arg}" `
    })

    const cmd = `yarn deploy-nft ${args}`

    console.log("deploying nft with the following command:\n", cmd)

    exec(cmd)
  }
}

main()
  .then(() =>
    console.log('NFT collection deployed successfully to blockchain')
  )
  .catch((e) =>
    console.log('An error ocurred while deploying to blockchain:', e)
  )
