const { network } = require("hardhat");
const { developmentNetworks, ethUsdAggregatorAddresses } = require("../helper-hardhat-config");
const { verify } = require("../Utils/utils");


module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    let ethUsdPriceFeed;
    if (developmentNetworks.includes(network.name)) {
        const mockAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = mockAggregator.address;
    }
    else {
        ethUsdPriceFeed = ethUsdAggregatorAddresses[network.config.chainId].priceFeed;
    }
    let args = [ethUsdPriceFeed];
    const fundMeContract = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });
    if (!developmentNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY)
        await verify(fundMeContract.address, args);

}

module.exports.tags = ["all", "fund-me"]