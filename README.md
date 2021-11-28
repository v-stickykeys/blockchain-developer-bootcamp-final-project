# Name of project here
<!-- project description -->

## Demo
<!-- link to frontend -->
<!-- link to Loom video walkthrough -->

## Directory structure

```
.
├── contracts/              // Solidity smart contracts
├── docs/
│   ├── avoiding_common_attacks.md
│   └── design_pattern_decisions.md
├── frontend/               // Web app
├── test/                   // Mocha + Chai contract tests
├── deployed_addresses.txt  // Contract addresses on Rinkeby
├── README.md               // You are here!
├── ...
```

## NFT recipient account address

`0x...`

# Usage

## Install dependencies

*Prerequisite: You must have node.js and npm installed*

```sh
npm install -g truffle
npm install @openzeppelin/contracts
npm i -g --only=prod https-localhost # Only if running the app locally
```

## Accessing the project
<!-- link to frontend -->

## Running locally

*Prerequisite: You must run a local blockchain like Ganache in the background*

```sh
truffle compile
truffle migrate
serve . # May need sudo depending on OS
```

Open `localhost:5000`, switch Metamask to your local blockchain network, and connect

### Create a frontend/env.js file containing the following

```
const INFURA_PROJECT_ID=<insert_yours_here>
const CONTRACT_ADDRESS_RINKEBY=<from_truffle_migrate>
```

## Run unit tests

```sh
truffle test
```
