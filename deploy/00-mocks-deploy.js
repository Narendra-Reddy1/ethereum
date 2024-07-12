const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {


    if (developmentChains.includes(network.config.chainId)) {
        console.log("Deploying mocks...........");
        const { deployer } = await getNamedAccounts();
        const { deploy, log } = deployments;
        const BASE_FEE = ethers.parseEther("20");
        const GAS_FEE = 1e9;
        const WEI_PER_UNIT_LINK = 100;
        const args = [BASE_FEE, GAS_FEE, WEI_PER_UNIT_LINK];
        await deploy("VRFCoordinatorV2_5Mock_1", {
            from: deployer,
            args: args,
            log: true
        })
        console.log("Done with deploying mocks............");
        console.log("___________________________________________________________________________________");
    }
}

module.exports.tags = ["all", "mocks"]