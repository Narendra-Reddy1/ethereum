const { ethers, run, network } = require("hardhat");


async function main() {

    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    const simpleSotrage = await SimpleStorageFactory.deploy();
    console.log(simpleSotrage);
    if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        const tx = await simpleSotrage.deploymentTransaction()
        await tx.wait(2);
        verify(simpleSotrage.target, [])
    }
    const currentvalue = await simpleSotrage.retrieve();
    const storeTx = await simpleSotrage.store(19090);
    await storeTx.wait(1);
    const updatedValue = await simpleSotrage.retrieve();
    console.log(`old value: ${currentvalue} ---> updated value:: ${updatedValue}`);
    const addPtx = await simpleSotrage.addPerson("Reddy", 1);
    await addPtx.wait(1);
    const storedPno = await simpleSotrage.getPerson("Reddy");
    console.log(`sotredNum: ${storedPno}`);

}

async function verify(contractAddress, args) {
    try {
        console.log(contractAddress);
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    }
    catch (err) {
        console.log(err);
    }

}


main().then(() => {
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
})