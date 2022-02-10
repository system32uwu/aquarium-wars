import { promises } from 'fs'

const { readdir, readFile } = promises

export type deployedCollection = {
  baseUri: string
  name: string
  symbol: string
  price: {
    type: string
    hex: string
  }
  maxmint: number
  address: string
}

export const getCollections = async (): Promise<deployedCollection[]> => {
  console.log('reading from:', `${process.cwd()}/deployed-contracts`)
  let collections: deployedCollection[] = []
  const dirname = `${process.cwd()}/deployed-contracts`
  const fileNames = await readdir(dirname)

  for (const fileName of fileNames) {
    const file = await readFile(`${dirname}/${fileName}`, 'utf8')
    let data = JSON.parse(file)

    collections.push(data)
  }
  console.log('returning the collections:', collections)
  return collections
}
