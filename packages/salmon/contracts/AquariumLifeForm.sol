//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

/// @title AquariumLifeForms, NFTs representing organisms of the Aquarium
/// @author Mateo Carriqui
/// @notice Mint life forms for the Aquarium

contract AquariumLifeForm is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseTokenURI;
  uint256 public price;
  uint256 public maxMint;
  uint256 public maxSupply;
  uint256 public reserved;
  bool public paused = true;

  /**
   * @param _baseTokenURI the ipfs url that points to the metadata files
   * @param _name the name for this collection of NFTs
   * @param _symbol the symbol for this collection of NFTs
   * @param _mintPrice the price for minting an NFT
   * @param _maxMint the maximum amount of NTFs that can be minted at once
   * @param _reserved amount reserved for giveaways / prizes
   */

  constructor(
    string memory _baseTokenURI,
    string memory _name,
    string memory _symbol,
    uint256 _mintPrice,
    uint256 _maxMint,
    uint256 _reserved,
    uint256 _maxSupply
  ) ERC721(_name, _symbol) {
    baseTokenURI = _baseTokenURI;
    setMintPrice(_mintPrice);
    maxMint = _maxMint;
    maxSupply = _maxSupply;
    reserved = _reserved;
  }

  function mintAQLF(uint256 _amount) public payable {
    uint256 _supply = totalSupply();
    uint256 _total = price * _amount;

    require(!paused, 'Sale paused');
    require(_amount <= maxMint, 'Max Mint amount exceeded.');
    require(
      _supply + _amount <= maxSupply - reserved,
      'Exceeds maximum AQLF supply'
    );
    require(msg.value >= _total, 'Incorrect payment sent');

    for (uint256 i; i < _amount; i++) {
      _safeMint(msg.sender, _supply + i + 1);
    }
  }

  function setMintPrice(uint256 _newPrice) public onlyOwner {
    price = _newPrice;
  }

  function _baseURI()
    internal
    view
    virtual
    override
    returns (string memory)
  {
    return baseTokenURI;
  }

  function getPrice() public view returns (uint256) {
    return price;
  }

  function giveAway(address _to, uint256 _amount) external onlyOwner {
    require(_amount <= reserved, 'Exceeds reserved NFT supply');

    uint256 supply = totalSupply();
    for (uint256 i; i < _amount; i++) {
      _safeMint(_to, supply + i);
    }

    reserved -= _amount;
  }

  function pause(bool _val) public onlyOwner {
    paused = _val;
  }

  function withdraw(address _to) public onlyOwner {
    payable(_to).transfer(address(this).balance);
  }
}
