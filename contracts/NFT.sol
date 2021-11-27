// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Mint-Burn Non-fungible Token
 * @author stickykeys.eth
 * @notice Creates a mintable/burnable NFT collection
 */
contract NFT {
    // PRICE

    // _baseTokenURI

    // _minted
    // _burned

    // _isCalling

    constructor() {}

    /**
     * @notice NFTs minted
     * @return Number of tokens minted
     */
    // function minted

    /**
     * @notice NFTs burned
     * @return Number of tokens burned
     */
    // function burned

    /**
     * @notice Set base URI for token metadata
     * @param baseTokenURI URI ending in a forward slash
     * @dev E.g. https://gallery.wetpaint.studio/WET/
     * @dev Caller must be contract owner
     */
    // function setBaseURI

    /**
     * @notice Mint and purchase tokens
     * @param amount Number of tokens to mint
     * @dev Increases minted count by amount
     * @dev Caller must supply amount * PRICE ether
     * @dev Token ids start from 1
     */
    // function mint

    /**
     * @notice Burn tokens and receive refund
     * @param tokenIds Array of tokenIds
     * @dev Increases burned count by the array length
     * @dev Refunds the owner ids * PRICE ether
     * @dev Can only burn max 50 per method call
     * @dev Caller must own all tokens listed
     */
    // function burn

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    // function _baseURI
}
