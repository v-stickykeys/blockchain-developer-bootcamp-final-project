# Solidity

Review the commenting format
https://docs.soliditylang.org/en/latest/natspec-format.html

Comment the contract and all methods

Documentation is inserted above each contract, interface, function, and event using the Doxygen notation format. A public state variable is equivalent to a function for the purposes of NatSpec.

# Compile

```
truffle compile
```

# Testing

Create test scaffold

Test an individual file. (If your contracts have changed, run compile first.)

```
truffle test test/NFT.spec.js --compile-none
```
