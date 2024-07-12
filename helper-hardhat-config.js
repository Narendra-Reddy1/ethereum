const { ethers } = require("hardhat");

developmentChains = [31337];
networkConfig = {
    11155111: {
        subscriptionId: "0",
        keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        callbackGasLimit: 25_00_000,
        vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
        entryFee: ethers.parseEther("0.1"),
        interval: 60
    },
    31337: {
        subscriptionId: "0",
        keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        callbackGasLimit: 25_00_000,
        entryFee: ethers.parseEther("0.1"),
        interval: 60
    }
}

module.exports = { developmentChains, networkConfig }