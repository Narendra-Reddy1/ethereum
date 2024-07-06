const { run } = require("hardhat")

const verify = (contractAddress, args) => {
    console.log("Verifying contract....", contractAddress, args);
    return run("verify:verify", {
        address: contractAddress,
        constructorArguments: args
    })

}

module.exports = { verify }