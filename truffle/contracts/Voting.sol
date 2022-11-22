// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting dapps
/// @author Jerome JULIEN (almost :) )
/// @notice This contract is a simple voting software. Admin can manage voters, proposals and voting session process. Voters can...vote !
/// @dev Multi voting session management is not yet implemented. COuld be fun
contract Voting is Ownable {
    /// @notice This uint allow to identify le winning proposal at the end of the process
    uint256 public winningProposalID;
    uint256 voterCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

    /// @notice Returns the address of each new voter registered
    event VoterRegistered(address voterAddress);

    /// @notice Returns the old and the new workflow status
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /// @notice Returns each new proposal registered
    /// @param proposalId Id of the created proposal
    event ProposalRegistered(uint256 proposalId);

    /// @notice Returns each vote registered (voter + proposal voted)
    /// @param voter address of the registered voter
    /// @param proposalId id the the voted proposal
    event Voted(address voter, uint256 proposalId);

    /// @notice event for the received() function
    /// @param _addr address of the sender
    event LogDepositReceived(address _addr);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //
    /// @notice function used to get a voter status
    /// @param _addr address of the searched voter
    /// @return Voter struct of the searched voter
    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /// @notice function used to get a proposal
    /// @param _id id of the searched proposal
    /// @return Proposal struct of the searched Proposal
    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //
    /// @notice add a new voter sor the session. Only for admin
    /// @dev the function check the workflow status and if the address is already registered before going forward
    /// @param _addr address of the voter to add
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        voterCount++;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //
    /// @notice add a new proposal sor the session. Only for registered voters
    /// @dev the function check the workflow status and if the proposal isn't empty before going forward
    /// @param _desc description of the proposal to add
    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /// @notice set the vote of a registered voter and update the winning proposal if needed
    /// @dev the function check the workflow status, the existance of the proposal chosen and if the voter hasn't alreayd voted
    /// @dev te winning propocal is updated in this function to prevent DDOS gas limit attack by usage of a loop in tallyVotes function
    /// @param _id id of the proposal to vote for
    function setVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        // update of the winning proposal at each vote to prevent DOS gaslimit attack
        if (
            proposalsArray[_id].voteCount >
            proposalsArray[winningProposalID].voteCount
        ) {
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    /// @notice status modifidation function. Launch the proposal registration and init the pre registered proposal
    ///@dev the function check the actual workflow status before going forward
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "DO KWON for LUNA crash";
        proposalsArray.push(proposal);
        proposal.description = "ALEX MASHINSKY for CELSIUS bankrun";
        proposalsArray.push(proposal);
        proposal
            .description = "SBF for 10B stollen !! (my favorite one...shut)";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /// @notice status modifidation function. Stop the proposal registration
    ///@dev the function check the actual workflow status before going forward
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /// @notice status modifidation function. Start the voting session
    ///@dev the function check the actual workflow status before going forward
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /// @notice status modifidation function. End the voting session
    ///@dev the function check the actual workflow status before going forward
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /// @notice status modifidation function. Tally the vote
    ///@dev the function check the actual workflow status before going forward
    /// @dev as winning proposal is updating at each vote, tallyvote just change the status
    function tallyVotes() external onlyOwner returns (uint256) {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );

        return winningProposalID;
    }

    /// @notice funciton to aese the front end development. Non core function for the final DAPP
    /// @dev this function just change the process status but didn't reset all parameters (voters, proposal). Could be a good upgrade
    function restartSession() external onlyOwner {
        workflowStatus = WorkflowStatus.RegisteringVoters;
        for (uint256 i = 0; i < proposalsArray.length; i++) {
            proposalsArray.pop();
        }
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.RegisteringVoters
        );
    }

    /// @notice received function in case of ether send to the contract
    receive() external payable {
        emit LogDepositReceived(msg.sender);
    }
}
