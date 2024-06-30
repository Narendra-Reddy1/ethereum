require("@nomicfoundation/hardhat-toolbox");
require("dotenv").configDotenv();



const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY

  },
  solidity: "0.8.8",
};
