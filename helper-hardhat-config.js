
const DECIMALS = 8;
const START_VALUE = 330700000000

ethUsdAggregatorAddresses = {
    11155111: {
        name: "Sepolia",
        priceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    80002: {
        name: "Amoy_Polygon_Testnet",
        priceFeed: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7"
    }

}

developmentNetworks = ["localhost", "hardhat"]

module.exports = {
    DECIMALS,
    START_VALUE,
    developmentNetworks,
    ethUsdAggregatorAddresses
}