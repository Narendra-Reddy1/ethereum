//require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")
//require("hardhat-contract-sizer")
require("dotenv").config()
//require("hardhat-deploy")
//require("ethereum-waffle")

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_API_KEY = process.env.COIN_MARKET_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {

    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],

    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      11155111: 0,
    },
    player: {
      default: 1
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: false,
    noColors: true,
    currency: "USD",
    outputFile: "gas-reporter.txt",
    // coinmarketcap: COIN_MARKET_API_KEY
  },
  contractSizer: {
    runOnCompile: false,
    only: ["Raffle", "VRFCoordinatorV2_5Mock"],
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0"
      },
      {
        version: "0.8.19"
      },
    ]

  },
};
