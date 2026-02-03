// Type definitions for the Escrow system

export interface TokenPayment {
  tokenIdentifier: string;
  amount: string;
  nonce: number;
  numDecimals?: number;
}

export interface Offer {
  offerID: number;
  creator: string;
  offeredPayment: TokenPayment;
  acceptedPayment: TokenPayment;
  acceptedAddress: string;
}

export interface CreateOfferRequest {
  offeredToken: string;
  offeredNonce: number;
  offeredAmount: string;
  acceptedToken: string;
  acceptedNonce: number;
  acceptedAmount: string;
  acceptedAddress: string;
}

export interface UpdateOfferRequest {
  offerId: number;
}

// Transaction response from backend
export interface TransactionResponse {
  nonce: number;
  value: string;
  receiver: string;
  sender: string;
  gasPrice: number;
  gasLimit: number;
  data: string;
  chainID: string;
  version: number;
}
