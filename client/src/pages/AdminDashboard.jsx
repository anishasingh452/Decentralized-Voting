import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../contractConfig";
import {
    Button, TextField, Typography, Container, List, ListItem, ListItemText, Box, Alert
} from '@mui/material';

export default function AdminDashboard() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [status, setStatus] = useState("");
    const [electionStarted, setElectionStarted] = useState(false);
    const [electionEnded, setElectionEnded] = useState(false);

    useEffect(() => {
        async function initWeb3() {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);
                const voting = new web3Instance.eth.Contract(contractABI, contractAddress);
                setWeb3(web3Instance);
                setContract(voting);
            }
        }
        initWeb3();
    }, []);

    async function fetchCandidates() {
        if (!contract) return;
        const count = await contract.methods.candidateCount().call();
        const arr = [];
        for (let i = 1; i <= count; i++) {
            let c = await contract.methods.candidates(i).call();
            arr.push(c);
        }
        setCandidates(arr);
    }

    async function fetchElectionState() {
        if (!contract) return;
        const started = await contract.methods.electionStarted().call();
        const ended = await contract.methods.electionEnded().call();
        setElectionStarted(started);
        setElectionEnded(ended);
    }

    useEffect(() => {
        if (contract) {
            fetchCandidates();
            fetchElectionState();
        }
    }, [contract]);

    const addCandidate = async (e) => {
        e.preventDefault();
        if (electionStarted) {
            setStatus("Cannot add candidates after election has started.");
            return;
        }
        setStatus("Adding candidate...");
        try {
            await contract.methods.registerCandidate(candidateName).send({ from: account });
            setStatus("Candidate added!");
            setCandidateName("");
            fetchCandidates();
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    };

    const startElection = async () => {
        setStatus("Starting election...");
        try {
            await contract.methods.startElection().send({ from: account });
            setStatus("Election started!");
            setElectionStarted(true);
            setElectionEnded(false);
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    };

    const resetElection = async () => {
        try {
            await contract.methods.resetElection().send({ from: account });
            alert("Election has been reset!");
            fetchCandidates(); // refresh candidate list
            setElectionStarted(false);
            setElectionEnded(false);
            setStatus("");
        } catch (err) {
            alert("Error resetting election: " + err.message);
        }
    };

    const endElection = async () => {
        setStatus("Ending election...");
        try {
            await contract.methods.endElection().send({ from: account });
            setStatus("Election ended!");
            setElectionEnded(true);
        } catch (err) {
            setStatus("Error: " + err.message);
        }
    };

    return (
        <Box className="center-box">
            <Box className="glass-card">
                <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: 600 }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: "#ccc" }}>
                    Connected Account: {account}
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ color: "#bbb" }}>
                    Election Status: {electionStarted ? (electionEnded ? "Ended" : "Active") : "Not started"}
                </Typography>

                <Box component="form" onSubmit={addCandidate} sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Candidate Name"
                        variant="outlined"
                        value={candidateName}
                        onChange={e => setCandidateName(e.target.value)}
                        required
                        disabled={electionStarted}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" sx={{
                        mt: 1,
                        backgroundColor: "#00DDFF",
                        color: "#0D0D0D",
                        fontWeight: 600,
                        "&:hover": {
                            backgroundColor: "#00C5E6",
                            boxShadow: "0 0 20px rgba(0, 221, 255, 0.4)"
                        }
                    }} type="submit" fullWidth disabled={electionStarted} >
                        Add Candidate
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={startElection}
                        disabled={electionStarted || electionEnded}
                        sx={{
                            flex: 1,
                            fontWeight: 600,
                            borderColor: "#00DDFF",
                            color: "#00DDFF",
                            "&:hover": {
                                borderColor: "#00C5E6",
                                backgroundColor: "rgba(0, 221, 255, 0.15)",
                                boxShadow: "0 0 20px rgba(0, 221, 255, 0.3)"
                            },
                            "&.Mui-disabled": {
                                borderColor: "#444444",
                                color: "#666666"
                            }
                        }}
                    >
                        Start Election
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={endElection}
                        disabled={!electionStarted || electionEnded}
                        sx={{
                            flex: 1,
                            fontWeight: 600,
                            borderColor: "#FF0099",
                            color: "#FF0099",
                            "&:hover": {
                                borderColor: "#E60088",
                                backgroundColor: "rgba(255, 0, 153, 0.15)",
                                boxShadow: "0 0 20px rgba(255, 0, 153, 0.3)"
                            },
                            "&.Mui-disabled": {
                                borderColor: "#444444",
                                color: "#666666"
                            }
                        }}
                    >
                        End Election
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={resetElection}
                        disabled={!electionEnded}
                        sx={{
                            flex: 1,
                            fontWeight: 600,
                            borderColor: "#00DDFF",
                            color: "#00DDFF",
                            "&:hover": {
                                borderColor: "#00C5E6",
                                backgroundColor: "rgba(0, 221, 255, 0.15)",
                                boxShadow: "0 0 20px rgba(0, 221, 255, 0.3)"
                            },
                            "&.Mui-disabled": {
                                borderColor: "#444444",
                                color: "#666666"
                            }
                        }}
                    >
                        Reset Election
                    </Button>

                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                    Candidates
                </Typography>
                <List>
                    {candidates.map(c => (
                        <ListItem key={c.id} divider sx={{ py: 1 }}>
                            <ListItemText primary={
                                <Typography sx={{ color: "#fff", fontWeight: 500 }}>{c.name}</Typography>
                            } secondary={
                                <Typography sx={{ color: "#00DDFF" }}>Votes: {c.voteCount}</Typography>
                            } />
                        </ListItem>
                    ))}
                </List>
                {status && <Alert severity={status.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>{status}</Alert>}
            </Box>
        </Box>
    );
}
