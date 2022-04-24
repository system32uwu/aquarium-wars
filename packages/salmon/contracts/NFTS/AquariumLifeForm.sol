//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/// @title AquariumLifeForms, NFTs representing organisms of the Aquarium
/// @author Mateo Carriqui
/// @notice Mint life forms for the Aquarium

contract AquariumLifeForm is ERC721Enumerable, Ownable {
  using Strings for uint256;
  using SafeMath for uint256;

  string public baseTokenURI;
  uint256 public price;
  uint256 public maxMint;
  uint256 public maxSupply;
  uint256 public reserved;
  bool public paused = true;

  IERC20 public PLANK;
  uint256 public feedFee;

  /// @notice costs 100 PLANK per battle
  mapping(uint256 => uint8) public battlesLeft;

  /**
   * @param _baseTokenURI the ipfs url that points to the metadata files
   * @param _name the name for this collection of NFTs
   * @param _symbol the symbol for this collection of NFTs
   * @param _mintPrice the price for minting an NFT
   * @param _maxMint the maximum amount of NTFs that can be minted at once
   * @param _reserved amount reserved for giveaways / prizes
   * @param _plank address of PLANK token
   * @param _feedFee amount of PLANK required to battle again
   */

  constructor(
    string memory _baseTokenURI,
    string memory _name,
    string memory _symbol,
    uint256 _mintPrice,
    uint256 _maxMint,
    uint256 _reserved,
    uint256 _maxSupply,
    address _plank,
    uint256 _feedFee
  ) ERC721(_name, _symbol) {
    baseTokenURI = _baseTokenURI;
    setMintPrice(_mintPrice);
    maxMint = _maxMint;
    maxSupply = _maxSupply;
    reserved = _reserved;
    PLANK = IERC20(_plank);
    feedFee = _feedFee;
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
      battlesLeft[_supply + i + 1] = 5; // all AQLFs start fed.
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

  /**
   * @notice sender must have approved allowance of PLANK to this address
   * @param _id the id of the AQLF to feed
   * @param _amount the amount of plank to feed
   * @notice example: send 500 PLANK and your AQLF will be able to battle 5 times
   */
  function feed(uint256 _id, uint256 _amount) public {
    require(
      uint8(_amount) / uint8(feedFee) > 0,
      'PLANK is not enough for a battle'
    );

    PLANK.transferFrom(_msgSender(), address(this), _amount);

    battlesLeft[_id] += uint8(_amount) / uint8(feedFee);
  }

  function aceptBattle(uint256 _id) public { // + off-chain gamble
    require(battlesLeft[_id] > 0, 'AQLF is not fed');

    PLANK.transferFrom(_msgSender(), address(this), feedFee);

    battlesLeft[_id] -= 1;
  }

}
