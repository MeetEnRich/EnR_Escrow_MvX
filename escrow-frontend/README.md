# Escrow dApp Frontend

A React-based decentralized application frontend for the MultiversX Escrow smart contract, enabling peer-to-peer token swaps with secure escrow functionality.

## Overview

This frontend allows users to:

- **Create offers**: Propose token swaps by specifying offered tokens, desired tokens, and recipient addresses
- **View offers**: Browse offers you've created or received
- **Accept offers**: Fulfill received offers from other users
- **Cancel offers**: Withdraw your pending offers

## Tech Stack

- **React 18** with TypeScript
- **Vite 5** for build tooling and HMR
- **React Router 6** for client-side routing
- **MultiversX SDK** (`@multiversx/sdk-core`, `@multiversx/sdk-dapp`, `@multiversx/sdk-dapp-ui`) for wallet integration and transaction signing
- **BigNumber.js** for precise token amount calculations

## Project Structure

```
src/
├── components/
│   ├── guards/          # Route protection (AuthGuard)
│   ├── layout/          # Header, Footer
│   ├── offers/          # CreateOfferForm, OfferCard, OffersList
│   └── wallet/          # ConnectButton, WalletInfo, TokensModal
├── config/              # Environment and app configuration
├── hooks/               # Custom hooks (useOffers)
├── pages/               # HomePage, DashboardPage
├── services/            # API client for backend communication
├── types/               # TypeScript interfaces (Offer, TokenPayment)
└── utils/               # Formatting utilities
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- MultiversX-compatible wallet (DeFi Wallet extension, xPortal, or Web Wallet)

### Installation

```bash
cd escrow-frontend
npm install
```

### Environment Configuration

Create a `.env` file or configure the existing one:

```env
# Backend API URL (NestJS escrow-services)
VITE_BACKEND_URL=http://localhost:3001

# Smart Contract Address
VITE_ESCROW_CONTRACT=erd1...

# Network Configuration
VITE_CHAIN_ID=D
VITE_API_URL=https://devnet-api.multiversx.com
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

## Key Features

### Wallet Integration

Supports multiple wallet providers:

- **DeFi Wallet Extension** - Browser extension
- **xPortal** - Mobile wallet via WalletConnect
- **Web Wallet** - MultiversX web-based wallet

Login is handled via Native Authentication for secure session management.

### Dashboard

Protected route requiring wallet connection. Provides three tabs:

1. **Create Offer** - Form to propose new token swaps
2. **My Offers** - Offers you've created (with cancel option)
3. **Received** - Offers sent to you (with accept option)

### Token Support

Pre-configured with common devnet tokens:

- WEGLD-bd4d79 (Wrapped EGLD)
- USDC-c76f1f (USD Coin)
- MEX-455c57 (MEX Token)

Custom token identifiers can be entered manually.

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview production build          |
| `npm run lint`    | Run ESLint                        |

## Backend Integration

The frontend communicates with the NestJS backend (`escrow-services`) via:

- `GET /escrow/offers/created` - Fetch user's created offers
- `GET /escrow/offers/received` - Fetch offers received by user
- `POST /escrow/offers/create` - Build create-offer transaction
- `POST /escrow/offers/confirm` - Build accept-offer transaction
- `POST /escrow/offers/cancel` - Build cancel-offer transaction

The backend returns unsigned transactions that are signed client-side using the connected wallet.

## Network

Currently configured for **MultiversX Devnet**. Network configuration is set in:

- `src/main.tsx` - SDK initialization with `EnvironmentsEnum.devnet`
- `src/config/index.ts` - API endpoints and chain ID
