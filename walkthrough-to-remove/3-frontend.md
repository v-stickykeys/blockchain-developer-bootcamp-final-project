# Edit your js files

Get your contract ABI from the `build` directory and paste it into abi.js

```js
const ABI=<insert_the_array_here>
```

Sign up for [Infura](https://infura.io/), create a project and copy the project id

Add it to your env.js file

```js
const INFURA_PROJECT_ID=<insert_yours_here>
```

Compile your contract with [Remix](https://remix.ethereum.org) and deploy to a test network.

> Note: Replace the openzeppelin imports with github links
> ```
> import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
> import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/ERC721.sol";
> ```

Make sure you have [testnet ETH](https://faucets.chain.link)

Add the deployed contract address to you env.js file

```js
const CONTRACT_ADDRESS_RINKEBY=<insert_yours_here>
```

# Edit your index.html

Add bootstrap

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
```

Add the following js libraries

```html
<script type="text/javascript" src="https://unpkg.com/web3@1.2.11/dist/web3.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/web3modal@1.9.0/dist/index.js"></script>
<script type="text/javascript" src="https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js"></script>
```

Add your own js files

```html
<script type="text/javascript" src="./env.js"></script>
<script type="text/javascript" src="./main.js"></script>
```

# Serve the frontend

```sh
cd frontend
npm i -g --only=prod https-localhost
sudo serve .
```
