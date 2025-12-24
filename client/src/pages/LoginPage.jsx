import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, TextField, Typography, Alert } from '@mui/material';
import { AuroraBackground } from '../components/ui/aurora-background';

export default function LoginPage() {
    const [type, setType] = useState(null);
    const [username, setUsername] = useState("");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const loginAdmin = async (e) => {
        e.preventDefault();
        setMessage("");
        const res = await fetch("/login/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) navigate("/admin");
        else setMessage(data.error || "Invalid credentials");
    };
    const loginVoter = async (e) => {
        e.preventDefault();
        setMessage("");
        const res = await fetch("/login/voter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginId, password }),
        });
        const data = await res.json();
        if (data.success) navigate("/voter");
        else setMessage(data.error || "Invalid credentials");
    };
    return (
        <AuroraBackground>
            <Box className="center-box">
                <Box className="glass-card">
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: "#fff", fontWeight: 500 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ fontSize: "18px", mb: 5, color: "#ccc" }}>
                        Sign in to your account
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                        <Button
                            variant={type === "admin" ? "contained" : "outlined"}
                            onClick={() => setType("admin")}
                            sx={{
                                backgroundColor: type === "admin" ? "#00DDFF" : "transparent",
                                color: type === "admin" ? "#0D0D0D" : "#00DDFF",
                                borderColor: "#00DDFF",
                                borderRadius: "6px",
                                fontWeight: 600,
                                padding: "15px 30px",
                                "&:hover": {
                                    backgroundColor: type === "admin" ? "#00C5E6" : "rgba(0, 221, 255, 0.15)",
                                    borderColor: "#00C5E6",
                                    boxShadow: "0 0 20px rgba(0, 221, 255, 0.3)"
                                }
                            }}
                        >
                            Admin
                        </Button>

                        <Button
                            variant={type === "voter" ? "contained" : "outlined"}
                            onClick={() => setType("voter")}
                            sx={{
                                backgroundColor: type === "voter" ? "#00DDFF" : "transparent",
                                color: type === "voter" ? "#0D0D0D" : "#00DDFF",
                                borderColor: "#00DDFF",
                                fontWeight: 600,
                                padding: "15px 30px",
                                "&:hover": {
                                    backgroundColor: type === "voter" ? "#00C5E6" : "rgba(0, 221, 255, 0.15)",
                                    borderColor: "#00C5E6",
                                    boxShadow: "0 0 20px rgba(0, 221, 255, 0.3)"
                                }
                            }}
                        >
                            Voter
                        </Button>
                    </Box>
                    {type === "admin" && (
                        <Box component="form" onSubmit={loginAdmin} noValidate>
                            <TextField margin="normal" fullWidth label="Admin Username"
                                value={username} onChange={e => setUsername(e.target.value)}
                                required variant="outlined" sx={{ mb: 2 }}
                            />
                            <TextField margin="normal" fullWidth label="Password" type="password"
                                value={password} onChange={e => setPassword(e.target.value)}
                                required variant="outlined" sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: "#00DDFF",
                                    color: "#0D0D0D",
                                    fontWeight: 600,
                                    "&:hover": {
                                        backgroundColor: "#00C5E6",
                                        boxShadow: "0 0 20px rgba(0, 221, 255, 0.4)"
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    )}
                    {type === "voter" && (
                        <Box component="form" onSubmit={loginVoter} noValidate>
                            <TextField margin="normal" fullWidth label="Voter Login ID"
                                value={loginId} onChange={e => setLoginId(e.target.value)}
                                required variant="outlined" sx={{ mb: 2 }}
                            />
                            <TextField margin="normal" fullWidth label="Password" type="password"
                                value={password} onChange={e => setPassword(e.target.value)}
                                required variant="outlined" sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: "#00DDFF",
                                    color: "#0D0D0D",
                                    fontWeight: 600,
                                    "&:hover": {
                                        backgroundColor: "#00C5E6",
                                        boxShadow: "0 0 20px rgba(0, 221, 255, 0.4)"
                                    }
                                }}
                            >
                                Login
                            </Button>

                        </Box>
                    )}
                    {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
                </Box>
            </Box>
        </AuroraBackground>
    );
}
