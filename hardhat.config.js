require("@nomicfoundation/hardhat-toolbox");
require("dotenv").configDotenv();
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_API = process.env.COIN_MARKET_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      11155111: 0,
      31337: 0,
      80002: 0
    }
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],

    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/TrCTSAqqzM_7LMlQWy2eYk4n3T52oXVm",
      chainId: 80002,
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY

  },
  gasReporter: {
    enabled: true,
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_MARKET_API,
    outputFile: "gas-report.txt",
  },
  solidity: "0.8.8",
};