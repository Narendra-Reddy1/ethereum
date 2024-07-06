
const { expect, assert } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");

describe("Funde ME", function () {

    let fundMe;
    let priceFeedMock;
    let deployer;
    let amount = ethers.parseEther("1");

    before(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        priceFeedMock = await ethers.getContract("MockV3Aggregator", deployer);

    })
    it("Should match the priceFeed Adress", async () => {
        const storedPriceFeed = await fundMe.getPriceFeed();
        expect(storedPriceFeed).to.equal(priceFeedMock.target);
    })
    describe("Funding", function () {

        it("Should fail if Eth is less than Min amount", async () => {

            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        })
        it("Should update the amount to data structure", async () => {
            await fundMe.fund({ value: amount });
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), amount.toString())
        });
        it("Should get funded with multiple accounts", async () => {
            let accounts = await ethers.getSigners();
            console.log("Lengthj", accounts.length)

            for (let i = 1; i < 7; i++) {
                const connectedContract = await fundMe.connect(accounts[i]);
                await connectedContract.fund({ value: ethers.parseEther("1") });
            }


            const contractStartingBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);

            const response = await fundMe.withdraw();
            const receipt = await response.wait(1);
            const { gasPrice, gasUsed } = receipt;
            const totalGasPrice = gasPrice * (gasUsed)


            const contractEndBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerEndBalance = await ethers.provider.getBalance(deployer);
            const amount = deployerEndBalance + (totalGasPrice);

            assert.equal(contractEndBalance, 0);
            assert.equal(deployerStartingBalance + contractStartingBalance,
                deployerEndBalance + totalGasPrice
            )

        });
    })

    describe("Withdral", function () {
        it("Should add withdrawl balance to founder", async () => {
            const contractStartingBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);

            const response = await fundMe.withdraw();
            const receipt = await response.wait(1);
            const { gasPrice, gasUsed } = receipt;
            const totalGasPrice = gasPrice * (gasUsed)


            const contractEndBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerEndBalance = await ethers.provider.getBalance(deployer);
            const amount = deployerEndBalance + (totalGasPrice);

            assert.equal(contractEndBalance, 0);
            assert.equal(deployerStartingBalance + contractStartingBalance,
                deployerEndBalance + totalGasPrice
            )
        });
        it("Should add withdrawl balance to founder from Cheaper_Withdraw", async () => {
            const contractStartingBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerStartingBalance = await ethers.provider.getBalance(deployer);

            const response = await fundMe.cheaperWithdraw();
            const receipt = await response.wait(1);
            const { gasPrice, gasUsed } = receipt;
            const totalGasPrice = gasPrice * (gasUsed)


            const contractEndBalance = await ethers.provider.getBalance(fundMe.target);
            const deployerEndBalance = await ethers.provider.getBalance(deployer);
            const amount = deployerEndBalance + (totalGasPrice);

            assert.equal(contractEndBalance, 0);
            assert.equal(deployerStartingBalance + contractStartingBalance,
                deployerEndBalance + totalGasPrice
            )
        });


        it("Should allow only owner to withdraw funds", async () => {

            const attacker = (await ethers.getSigners())[2];
            const connectedContract = await fundMe.connect(attacker);
            console.log(attacker);
            await expect(connectedContract.withdraw()).to.be.reverted
        })
    })
});