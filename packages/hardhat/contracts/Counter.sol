// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.13;

// 2. Imports
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

// 3. Interfaces, Libraries, Contracts
error FundMe__NotOwner();
interface IMyToken {
    function mint(address to, uint256 amount) external ;
    }
    
contract Counter {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    uint256 public constant MINIMUM_USD = 0.05 * 10 ** 18;
    address private immutable i_owner;
    uint256 public number;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    IMyToken public myToken;
    AggregatorV3Interface private s_priceFeed;

    // Events
    event TokenMinted(address indexed to, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address tokenAddress, address priceFeed) {
        i_owner = msg.sender;
        myToken = IMyToken(tokenAddress);
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    // Check、Effect、Interact
    function incrementWithFund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");

        number++;
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);

        myToken.mint(msg.sender, 100 * 10 ** 18);
        emit TokenMinted(msg.sender, 100 * 10 ** 18);
    }

    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // payable(msg.sender).transfer(address(this).balance);
        (bool success,) = i_owner.call{value: address(this).balance}("");
        require(success);
    }


    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }
}

