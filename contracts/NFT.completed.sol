// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Mint-Burn Non-fungible Token
 * @author stickykeys.eth
 * @notice Creates a mintable/burnable NFT collection
 */
contract NFTCompleted is Ownable, ERC721 {
    /**
     * @notice Price per token mint
     * @return Wei
     */
    uint256 public constant PRICE = 0.1 ether;

    string private _baseTokenURI;

    uint256 private _minted;
    uint256 private _burned;

    mapping(address => bool) private _isCalling;

    constructor() ERC721("BonBonNFT", "BB") {}

    /**
     * @notice NFTs minted
     * @return Number of tokens minted
     */
    function minted() external view returns(uint256) {
        return _minted;
    }

    /**
     * @notice NFTs burned
     * @return Number of tokens burned
     */
    function burned() external view returns(uint256) {
        return _burned;
    }

    /**
     * @notice Set base URI for token metadata
     * @param baseTokenURI URI ending in a forward slash
     * @dev Caller must be contract owner
     */
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @notice Mint and purchase tokens
     * @param amount Number of tokens to mint
     * @dev Increases minted count by amount
     * @dev Caller must supply amount * PRICE ether
     * @dev Token ids start from 1
     */
    function mint(uint256 amount) external payable {
        require(!_isCalling[msg.sender], "No re-entrancy");
        _isCalling[msg.sender] = true;

        uint256 cost = amount * PRICE;
        require(msg.value >= cost, "Insufficient ether");

        uint256 startingMintedAmount = _minted;
        _minted = _minted + amount;
        for (uint256 i = 0; i < amount; i++) {
            _safeMint(msg.sender, startingMintedAmount + i + 1);
        }

        _isCalling[msg.sender] = false;
    }

    /**
     * @notice Burn tokens and receive refund
     * @param tokenIds List of tokenIds
     * @dev Increases burned count by the array length
     * @dev Refunds the owner ids * PRICE ether
     * @dev Can only burn max 50 per method call
     * @dev Caller must own all tokens listed
     */
    function burn(uint256[] memory tokenIds) external {
        require(!_isCalling[msg.sender], "No re-entrancy");
        _isCalling[msg.sender] = true;

        require(tokenIds.length < 51, "Exceeds limit per call");
        require(tokenIds.length <= _minted, "Invalid array length");

        uint256 cost = tokenIds.length * PRICE;
        require(address(this).balance >= cost, "Insufficient ether");

        _burned = _burned + tokenIds.length;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(ownerOf(tokenIds[i]) == msg.sender, "Caller must own tokens");
            _burn(tokenIds[i]);
        }

        (bool success, ) = msg.sender.call{value: cost}("");
        require(success, "Ether transfer failed");

        _isCalling[msg.sender] = false;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
