require("@nomicfoundation/hardhat-toolbox");
require("dotenv").configDotenv();
require("solidity-coverage")


const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COIN_MARKET_API = process.env.COIN_MARKET_API;
console.log("coin marketcap apikey", COIN_MARKET_API);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [PRIVATE_KEY]
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY

  },
  gasReporter: {
    enabled: false,
    noColors: true,
    currency: "INR",
    coinmarketcap: COIN_MARKET_API,
    outputFile: "gas-report.txt",
  },
  solidity: "0.8.8",
};
