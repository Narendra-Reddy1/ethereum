const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {

    let contractFactory;
    let simpleStorage;

    before(async function () {
        contractFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await contractFactory.deploy();
    })
    it("Should start with initial values of 0", async () => {
        const expectedValue = "23230";
        const currentValue = await simpleStorage.retrieve();
        expect(currentValue.toString()).to.equal(expectedValue);
    })

    it("Should store the given value", function (done) {
        const valueToStore = "9999";
        simpleStorage.store("8").then(() => {
            return simpleStorage.retrieve();
        }).then((result) => {

            expect(result.toString()).to.equal(valueToStore);

            done();
        }).catch(err => {
            console.log(err);
            done(err);
        })

    })
});