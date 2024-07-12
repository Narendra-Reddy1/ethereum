const { network, deployments, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { expect, assert } = require("chai");

!developmentChains.includes(network.config.chainId) ? describe.skip : describe("Raffle", function () {
    let Raffle, VRFCoordinatorV2_5Mock_1, player;
    beforeEach(async () => {
        await deployments.fixture(["all"]);
        Raffle = await ethers.getContract("Raffle");
        Raffle.connect(player)
    })

    describe("Constructor", function () {

        it("Should initialize constructor properly", async () => {
            const currentState = await Raffle.getRaffleState();
            const raffleInterval = await Raffle.getRaffleInterval();
            console.log(currentState);
            assert.equal(raffleInterval.toString(), networkConfig[network.config.chainId].interval.toString())
            expect(currentState.toString()).equal("0");

        })
    })
    describe("Entering Raffle", function () {
        it("Should revert if entry fee is less", async () => {
            await expect(Raffle.enterRaffle()).to.be.revertedWith("Raffle_MinEntryNotSent")
        })
        it("Should emit event on raffle enter", async () => {
            const entryfee = ethers.parseEther("0.1");
            const tx = await Raffle.enterRaffle({ value: entryfee });
            const txx = await tx.wait();
            console.log(tx);
            console.log("__________________________________________________________________________");
            console.log(txx);
            expect(txx).to.be.emit(Raffle, "EnteredRaffle");
            //await expect(Raffle.enterRaffle({ value: entryfee })).to.emit(Raffle);
        })

    })
    //describe("")

})