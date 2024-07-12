const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");



module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    /* 
       address vrfCoordinator,
        uint256 subId,
        uint32 callbackGasLimit,
        bytes32 keyHash,
        uint256 interval,
        uint256 entryFee
         */
    const config = networkConfig[network.config.chainId];
    let coordinator;
    if (developmentChains.includes(network.config.chainId)) {
        const coordinatorContract = await deployments.get("VRFCoordinatorV2_5Mock_1");
        coordinator = coordinatorContract.address;
    }
    else
        coordinator = config.vrfCoordinator;

    const args = [coordinator, config.subscriptionId, config.callbackGasLimit, config.keyHash, config.interval, config.entryFee];
    console.log("Deplying Raffle Contract.................");
    await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
    })
    console.log("Raffle Contract Deployed.................");
    console.log("_________________________________________________________________");
}
module.exports.tags = ["all", "raffle"]