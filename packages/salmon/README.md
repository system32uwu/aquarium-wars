# Salmon

Salmon is the one in charge of the Smart Contracts, these were written in Solidity, because Salmon and Solidty both start with S.

## Usage

Run the tests, I said run them damn it! `yarn hardhat test`

Run a local ethereum blockchain node: `yarn hardhat node`

Run `yarn hardhat deploy-currency --network localhost 20000000 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` to deploy your currency!

Then you can either connect through metamask or use the hardhat CLI to play around with the token.

To deploy a collection the process is similar, don't stop your node:

Run `yarn hardhat deploy-nft --network localhost ipfs:///QmfZFRYsYoC3F3MT3YTAgNFs9nG2JfrT1xJEFTffMgaW8N/ "Mutant Anchovies" AQMA 100 20 100 100`

NOTE: the baseURI should be the URI of your metadata files, it can use an HTTP gateway instead of the ipfs protocol directly as explained in `shark`

For further information on this scripts, run `yarn hardhat help name_of_script`

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
