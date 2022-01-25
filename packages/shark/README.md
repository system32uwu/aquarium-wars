# Shark

Shark is the one in charge of processing all of your assets, it will end up outputting all of your fishy NFT collections (his stomach does such cool things!).

## About

Fork of [nft-collection-generator](https://github.com/manuelpires/nft-collection-generator.git), made to produce multiple collections with different config files for the Aquarium

## Setup

I'm running docker-compose with an instance of [go-ipfs](https://hub.docker.com/r/ipfs/go-ipfs), otherwise you can install it to your system.

## Usage

### Creating a new collection

`yarn create-collection MyCollection`  

This will generate a new directory under `collections`, with the name `MyCollection`

#### Contents of generated directory

* `traits`: An empty directory, were you should place your layers
 - Suggested format: `XX-LayerName/AssetName.png`
 - Example: `00-Background/Green.png`
* `config.js`: The configuration file for the collection to be generated, update the variables in this template according to your project specifications

#### Testing the configuration you made

Regardless of your javascript knowledge, the tests are there to be run, I wrote them for you, so run them before opening an issue about an error with this package

`yarn test MyCollection`

### Build the Collection

This will generate an `output` directory under `collections/MyCollection`, inside there'll be the directory `MyCollection`, which contains the `images` and `metadata` directories

Use this command to test if the values you provided in the configuration file are ok, I recommend spending some time playing with them until you get a "more balanced" collection (mainly just changing the weight of each asset will do, but there are other options you can also try for more interesting results)

`yarn build MyCollection`

### Deploy the Collection

This will upload the generated images and metadata to the service you chose (IPFS or centralized server).

`yarn deploy MyCollection`

### Generate a gif previewing some of the generated assets

This will create `preview.gif` under `collections/MyCollection/output/MyCollection`

`yarn generate-gif MyCollection`

### Validate generated assets

`yarn calculate-hash`

### Bite!

Shark will bite your NFT collection, swallow it, and eventually, output it (that's how the digestive system works!).

This tests, builds and deploys the collection, it also generates a gif preview and returns the provenance hash for the generated assets.

`yarn bite MyCollection`