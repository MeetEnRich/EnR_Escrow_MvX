import { config } from '../config';
import type { Offer, CreateOfferRequest, UpdateOfferRequest, TransactionResponse } from '../types/offer';

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = config.backendUrl;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get offers created by the connected wallet
  async getCreatedOffers(): Promise<Offer[]> {
    return this.request<Offer[]>('/offers/created');
  }

  // Get offers where connected wallet is the accepted address
  async getReceivedOffers(): Promise<Offer[]> {
    return this.request<Offer[]>('/offers/received');
  }

  // Create a new offer - returns transaction to sign
  async createOffer(offer: CreateOfferRequest): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('/offers/create', {
      method: 'POST',
      body: JSON.stringify(offer),
    });
  }

  // Confirm/accept an offer - returns transaction to sign
  async confirmOffer(offerId: number): Promise<TransactionResponse> {
    const request: UpdateOfferRequest = { offerId };
    return this.request<TransactionResponse>('/offers/confirm', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Cancel an offer - returns transaction to sign
  async cancelOffer(offerId: number): Promise<TransactionResponse> {
    const request: UpdateOfferRequest = { offerId };
    return this.request<TransactionResponse>('/offers/cancel', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();
