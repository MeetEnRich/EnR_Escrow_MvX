# EnRich Escrow - MultiversX

A full-stack decentralized escrow application built on the MultiversX blockchain. This project demonstrates peer-to-peer token swaps using a secure smart contract, a NestJS backend service, and a React frontend.

## Project Structure

```
EnR_Escrow_MvX/
├── escrow/              # Rust smart contract (MultiversX SC)
├── escrow-services/     # NestJS backend API
├── escrow-frontend/     # React + Vite frontend
```

## 🔗 Components

### Smart Contract (`escrow/`)

Rust-based MultiversX smart contract that handles:

- Creating escrow offers (token deposits)
- Accepting/confirming offers
- Canceling offers
- Secure token swaps between parties

**Tech Stack:** Rust, multiversx-sc framework

### Backend Services (`escrow-services/`)

NestJS backend that provides:

- REST API for escrow operations
- Native authentication (SDK auth)
- Smart contract interaction via SDK
- Transaction building

**Tech Stack:** NestJS, TypeScript, @multiversx/sdk-core, Redis

### Frontend (`escrow-frontend/`)

React application featuring:

- Wallet connection (xPortal, DeFi Wallet, Web Wallet, Ledger)
- Create/manage escrow offers
- View token balances
- Transaction signing

**Tech Stack:** React 18, Vite, TypeScript, @multiversx/sdk-dapp v5

## Getting Started

### Prerequisites

- Node.js 18+
- Rust & Cargo (for smart contract)
- mxpy CLI (MultiversX Python SDK)
- Redis (for backend caching)

### Smart Contract

```bash
cd escrow
mxpy contract build
mxpy contract deploy --bytecode output/escrow.wasm --keyfile <wallet.json> --gas-limit 100000000 --proxy https://devnet-gateway.multiversx.com --chain D
```

### Backend Services

```bash
cd escrow-services
npm install
# Configure environment variables (see .env.example)
npm run start:dev
```

### Frontend

```bash
cd escrow-frontend
npm install
# Configure VITE_BACKEND_URL in .env
npm run dev
```

## Environment Variables

### Backend (`escrow-services/.env`)

```env
PORT=3001
REDIS_HOST=localhost
REDIS_PORT=6379
API_URL=https://devnet-api.multiversx.com
CONTRACT_ADDRESS=erd1qqqqqq...
```

### Frontend (`escrow-frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3001
```

## Network

This project is configured for **MultiversX Devnet**.

- Explorer: https://devnet-explorer.multiversx.com
- API: https://devnet-api.multiversx.com
- Gateway: https://devnet-gateway.multiversx.com

## Resources

- [MultiversX Docs](https://docs.multiversx.com)
- [SDK-Dapp Documentation](https://docs.multiversx.com/sdk-and-tools/sdk-dapp)
- [Smart Contract Framework](https://docs.multiversx.com/developers/smart-contracts)

## Author

**EnRich** - [@MeetEnRich](https://x.com/MeetEnRich)

## License

This project is for educational purposes as part of the EnRich Escrow Tutorial series.
