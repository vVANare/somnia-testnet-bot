# Somnia Testnet Automation

A JavaScript-based automation tool for interacting with the Somnia testnet network. This tool provides functionality for managing wallets, interacting with faucets, and deploying smart contracts.

## Features

- Wallet Management
  - Create/Update wallet tables from private keys
  - Toggle wallets ON/OFF based on balance
  - Manage wallet states in Excel format
- Network Interactions
  - Get $STT tokens from faucet
  - Send $STT to random addresses
  - Deploy ERC-20 and ERC-721 smart contracts
- Proxy Support
  - Configure and use proxies for network requests
  - Automatic proxy rotation

## Prerequisites

- Node.js (v16 or higher)
- Bun runtime

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vVANare/somnia-testnet-bot.git
cd somnia-testnet-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `data/privkeys.txt` file with your private keys (one per line, starting with '0x')

## Configuration

Edit `data/config.js` to customize:
- RPC URLs
- Sleep ranges between operations
- Faucet attempts
- Random send amounts
- Wallet shuffling behavior

## Usage

Run the application:
```bash
npm start
```

Available commands:
1. Create or Update Wallets Table
2. "ON" Wallets with zero balance
3. "OFF" Wallets with zero balance
4. "ON" All Wallets
5. "OFF" All Wallets
6. Get $STT from Faucet
7. Send $STT to random address
8. Deploy ERC-20 smart-contract
9. Deploy ERC-721 smart-contract

## License

MIT
