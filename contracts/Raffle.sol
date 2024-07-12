// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";

contract Raffle is VRFConsumerBaseV2Plus, KeeperCompatible {
    enum Raffle_State {
        OPEN,
        CALCULATING
    }
    error Raffle_NotLiveNow();
    error Raffle_UpKeepNotNeeded(uint256 currentBalance, uint256 playersCount, uint256 raffleState);
    error Raffle_MinEntryNotSent();
    error Raffle_WinAmountTransferFailed();

    event RequestedRaffleWinner(uint256 indexed reqId);
    event EnteredRaffle(address indexed player);
    event WinnerAnnounced(address indexed winner);

    uint256 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit; //ceiling for gas to call the fulfillRandomWords method from chainlink.
    bytes32 private immutable i_keyHash;
    uint256 private immutable i_entryFee;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address payable[] private s_players;
    Raffle_State private s_currentRaffleState;
    uint256 private s_interval;
    uint256 s_lastTimestamp;
    address s_recentWinner;

    constructor(
        address vrfCoordinator,
        uint256 subId,
        uint32 callbackGasLimit,
        bytes32 keyHash,
        uint256 interval,
        uint256 entryFee
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        i_subscriptionId = subId;
        i_callbackGasLimit = callbackGasLimit;
        i_keyHash = keyHash;
        i_entryFee = entryFee;
        s_currentRaffleState = Raffle_State.OPEN;
        s_interval = interval;
        s_lastTimestamp = block.timestamp;
    }

    function enterRaffle() external payable {
        if (s_currentRaffleState != Raffle_State.OPEN) revert Raffle_NotLiveNow();
        if (msg.value < i_entryFee) revert Raffle_MinEntryNotSent();
        s_players.push(payable(msg.sender));
        emit EnteredRaffle(msg.sender);
    }

    //KeeperCompatible
    function checkUpkeep(
        bytes memory /* checkData */
    ) public override returns (bool upkeepNeeded, bytes memory /*  performData */) {
        bool isOpen = s_currentRaffleState == Raffle_State.OPEN;
        bool arePlayersParticipated = s_players.length > 0;
        bool hasTimePassed = (s_lastTimestamp - block.timestamp) >= s_interval;
        upkeepNeeded = isOpen && arePlayersParticipated && hasTimePassed;
    }

    function performUpkeep(bytes memory /* performData */) external override {
        //Just for learnig purpose we are making this method public accessed and calling it here.
        (bool upKeedNeeded, ) = checkUpkeep("");
        if (!upKeedNeeded)
            revert Raffle_UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_currentRaffleState)
            );
        s_currentRaffleState = Raffle_State.CALCULATING;
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        emit RequestedRaffleWinner(requestId);
    }

    //VRFConsumerBaseV2Plus
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] calldata randomWords
    ) internal override {
        address payable winner = s_players[(randomWords[0] % s_players.length)];
        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) revert Raffle_WinAmountTransferFailed();
        s_players = new address payable[](0);
        s_lastTimestamp = block.timestamp;
        s_currentRaffleState = Raffle_State.OPEN;
        s_recentWinner = winner;
        emit WinnerAnnounced(winner);
    }

    function getEntryFee() external view returns (uint256) {
        return i_entryFee;
    }

    function getKeyHash() external view returns (bytes32) {
        return i_keyHash;
    }

    function getRaffleInterval() external view returns (uint256) {
        return s_interval;
    }

    function getParticipantCount() external view returns (uint256) {
        return s_players.length;
    }

    function getRecentWinner() external view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() external view returns (uint256) {
        return uint256(s_currentRaffleState);
    }
}
