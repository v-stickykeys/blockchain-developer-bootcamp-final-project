Install truffle

```
npm install -g truffle
```

Create a new project

```
mkdir blockchain-developer-bootcamp-final-project
cd blockchain-developer-bootcamp-final-project
git init
truffle init
```

Setup the frontend

```
mkdir frontend
touch frontend/index.html
touch frontend/main.js
touch frontend/env.js
```

Structure the docs

```
mkdir docs
touch README.md
touch docs/avoiding_common_attacks.md
touch docs/design_pattern_decisions.md
```

Install openzeppelin contracts

```sh
npm install @openzeppelin/contracts
# npm install @openzeppelin/contracts-upgradeable # optional
```

Update the truffle config to compile the OZ contracts

```
module.exports = {
  contracts_directory: "./",
  contracts_build_directory: "./build",
  ...
```

Start the smart contracts

```
touch contracts/NFT.sol
```
