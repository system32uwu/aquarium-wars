//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Plankton Token, the in-game currency for Aquarium Wars
/// @author Mateo Carriqui
/// @notice Mint and Burn Planktons

contract Plankton is ERC20, Ownable {
  uint256 public initialSupply;

  /// @dev mew planktons are minted when totalSupply reaches 50% of initialSupply
  event PlanktonsMinted(address _to, uint256 _amount);

  /// @dev planktons are burned when feeding Aquarium Life Forms
  event PlanktonsBurned(address _from, uint256 _amount);

  /**
   * @param _initialSupply initial supply when deploying the token on a network
   * @param _beneficiary The address that will receive the minted tokens
   */
  constructor(uint256 _initialSupply, address _beneficiary)
    ERC20("Plankton", "PLANK")
  {
    _mint(_beneficiary, _initialSupply);
    initialSupply = _initialSupply;
  }

  /// @dev Mint new Planktons
  function mintPlanktons(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
    emit PlanktonsMinted(_to, _amount);
  }

  /// @dev Burn Planktons
  /// @notice Feeding an AQLF burns the used ammount of PLANK
  function burnPlanktons(uint256 _amount) public {
    _burn(_msgSender(), _amount);
    emit PlanktonsBurned(_msgSender(), _amount);
  }
}
