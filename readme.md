# Decentralized Voting DApp

This project is a decentralized voting application built with Solidity smart contracts, React frontend, Node.js backend, and SQLite for persistent storage. It enables secure, transparent elections on the blockchain with admin and voter roles.

***

## Features

- **Admin Dashboard**
  - Register candidates before election start
  - Start, end, and reset election lifecycle
  - View candidate list and live vote counts
- **Voter Dashboard**
  - View candidates and current votes
  - Vote for candidates securely on blockchain
  - Prevent double voting per election round
- **Authentication**
  - Admin and voter login system
  - Password hashing and secure signup/login

***

## Tech Stack

- **Smart Contract:** Solidity, deployed on Ethereum-compatible blockchain (e.g. Ganache)
- **Frontend:** React.js with Material-UI and Framer Motion animations
- **Backend:** Node.js with Express.js and Sequelize ORM
- **Database:** SQLite for storing admin and voter credentials securely

***

## Getting Started

### Prerequisites

- Node.js and npm installed
- Ganache or other local blockchain environment running at port 8545
- MetaMask extension set to connect to your local blockchain
- Git installed (optional)

### Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/decentralized-voting.git
cd decentralized-voting
```

2. Install backend dependencies:

```bash
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

### Running Locally

1. Start local blockchain (Ganache):

```bash
ganache-cli
```

2. Deploy smart contracts (using Truffle or Hardhat):

```bash
truffle migrate --reset
```

3. Start backend server:

```bash
node index.js
```

4. Start React frontend:

```bash
cd client
npm start
```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

***

## Usage

- Register admin and voters via backend API (Postman or modify UI)
- Use Admin Dashboard to add candidates and manage elections
- Use Voter Dashboard to cast votes during active election
- Election security is enforced by blockchain smart contract rules

***

## Project Structure

- `contracts/` - Solidity smart contract files
- `client/` - React frontend source code
- `index.js` - Backend Node.js server and API routes
- `models/` - Sequelize models for Admin and Voter
- `database.sqlite` - SQLite data file (auto-created)

***

## Notes

- Election start/end/reset functions restricted to admin Ethereum account
- Frontend connects to backend via proxy, backend talks to blockchain node
- Be sure MetaMask is connected to same localhost blockchain network

***

## Future Enhancements

- Multi-admin support in smart contracts
- Improved UI/UX with notifications and error handling
- Deploy to testnet/mainnet with environment config
- Votes delegation, weighted voting, or election anonymity features

***

## License

This project is open source under the MIT License.

***
