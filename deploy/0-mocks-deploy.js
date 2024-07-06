const { getUnnamedAccounts, network } = require("hardhat");
const { DECIMALS, START_VALUE, developmentNetworks } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {

    if (!developmentNetworks.includes(network.name)) return;
    console.log("Local network::: ", network.name, " deploying Mocks")
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const result = await deploy("MockV3Aggregator", {
        from: deployer,
        log: true,
        args: [
            DECIMALS,
            START_VALUE
        ]
    });
    console.log("Mock deployment completed....");
    console.log("_____________________________________________________________________________________________________");
}
module.exports.tags = ["all", "mocks"]