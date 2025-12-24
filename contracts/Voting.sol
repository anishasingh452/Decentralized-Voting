// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public electionStarted;
    bool public electionEnded;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidateCount;

    mapping(address => bool) public hasVoted;
    address[] public voterList; // Track all voters

    event CandidateRegistered(uint id, string name);
    event VoteCasted(address voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    modifier electionActive() {
        require(electionStarted && !electionEnded, "Election not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionStarted = false;
        electionEnded = false;
    }

    function registerCandidate(string memory name) public onlyAdmin {
        require(!electionStarted, "Can't register after election starts");
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
        emit CandidateRegistered(candidateCount, name);
    }

    function startElection() public onlyAdmin {
        require(!electionStarted, "Election already started");
        electionStarted = true;
    }

    function endElection() public onlyAdmin {
        require(electionStarted, "Election not started");
        electionEnded = true;
    }

    function resetElection() public onlyAdmin {
        require(electionEnded, "Election is ongoing");
        
        // Clear candidates
        for (uint i = 1; i <= candidateCount; i++) {
            delete candidates[i];
        }
        candidateCount = 0;

        // Clear all voters
        for (uint i = 0; i < voterList.length; i++) {
            hasVoted[voterList[i]] = false;
        }
        delete voterList; // Clear the voter list array

        // Reset election state
        electionStarted = false;
        electionEnded = false;
    }

    function vote(uint candidateId) public electionActive {
        require(!hasVoted[msg.sender], "Already voted!");
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate");
        
        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        voterList.push(msg.sender); // Track this voter
        
        emit VoteCasted(msg.sender, candidateId);
    }
}
