import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../contractConfig";
import {
    Container, Typography, List, ListItem, ListItemText, Button, Select,
    MenuItem, FormControl, InputLabel, Alert, Box
} from "@mui/material";

export default function VoterDashboard() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [candidateId, setCandidateId] = useState("");
    const [message, setMessage] = useState("");
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        async function initWeb3() {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                const voting = new web3Instance.eth.Contract(
                    contractABI,
                    contractAddress
                );
                setWeb3(web3Instance);
                setContract(voting);
            }
        }
        initWeb3();
    }, []);

    async function fetchCandidates() {
        if (!contract) return;
        try {
            const count = await contract.methods.candidateCount().call();
            const arr = [];
            for (let i = 1; i <= count; i++) {
                let c = await contract.methods.candidates(i).call();
                arr.push(c);
            }
            setCandidates(arr);
        } catch (e) {
            setMessage("Contract error");
        }
    }

    async function fetchHasVoted() {
        if (!contract || !account) return;
        const voted = await contract.methods.hasVoted(account).call();
        setHasVoted(voted);
    }

    useEffect(() => {
        if (contract) {
            fetchCandidates();
            fetchHasVoted();
        }
    }, [contract, account]);

    const voteForCandidate = async (e) => {
        e.preventDefault();
        if (!candidateId) return setMessage("Select a candidate!");
        setMessage("Submitting vote...");
        try {
            await contract.methods.vote(candidateId).send({ from: account });
            setMessage("Vote successful!");
            setHasVoted(true);
            fetchCandidates();
        } catch (err) {
            setMessage("Vote failed: " + err.message);
        }
    };

    return (
        <Box className="center-box">
            <Box className="glass-card">
                <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: 600 }}>
                    Voter Dashboard
                </Typography>
                <Typography gutterBottom sx={{ color: "#ccc" }}>
                    Connected Account: {account}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                    Candidates
                </Typography>
                <List>
                    {candidates.map(c => (
                        <ListItem key={c.id} divider sx={{ py: 1 }}>
                            <ListItemText
                                primary={
                                    <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                                        {c.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography sx={{ color: "#00DDFF" }}>
                                        Votes: {c.voteCount}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                {hasVoted ? (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        You have already voted!
                    </Alert>
                ) : (
                    <Box component="form" onSubmit={voteForCandidate} sx={{ mt: 3 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="candidate-select-label" sx={{ color: "#fff" }}>
                                Select Candidate
                            </InputLabel>
                            <Select
                                labelId="candidate-select-label"
                                value={candidateId}
                                label="Select Candidate"
                                onChange={e => setCandidateId(e.target.value)}
                                required
                                variant="filled"
                                sx={{ bgcolor: "rgba(40,44,52,0.85)", color: "#fff" }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {candidates.map(c => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" type="submit" fullWidth sx={{ fontWeight: 600 }}>
                            Vote
                        </Button>
                    </Box>
                )}
                {message && (
                    <Alert severity={message.startsWith("Vote failed") ? "error" : "info"} sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Box>
    );
}
