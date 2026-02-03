import { useState, useEffect, useCallback } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react/loginInfo/useGetLoginInfo';
import { apiService } from '../services/api';
import type { Offer, CreateOfferRequest } from '../types/offer';

export function useOffers() {
  const [createdOffers, setCreatedOffers] = useState<Offer[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isLoggedIn = useGetIsLoggedIn();
  const { tokenLogin } = useGetLoginInfo();

  // Set auth token when available
  useEffect(() => {
    if (tokenLogin?.nativeAuthToken) {
      apiService.setAuthToken(tokenLogin.nativeAuthToken);
    } else {
      apiService.clearAuthToken();
    }
  }, [tokenLogin?.nativeAuthToken]);

  // Fetch all offers
  const fetchOffers = useCallback(async () => {
    if (!isLoggedIn || !tokenLogin?.nativeAuthToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [created, received] = await Promise.all([
        apiService.getCreatedOffers(),
        apiService.getReceivedOffers(),
      ]);
      setCreatedOffers(created);
      setReceivedOffers(received);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, tokenLogin?.nativeAuthToken]);

  // Create offer
  const createOffer = useCallback(async (offer: CreateOfferRequest) => {
    if (!isLoggedIn) throw new Error('Not logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const transaction = await apiService.createOffer(offer);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create offer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Cancel offer
  const cancelOffer = useCallback(async (offerId: number) => {
    if (!isLoggedIn) throw new Error('Not logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const transaction = await apiService.cancelOffer(offerId);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel offer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Accept offer
  const acceptOffer = useCallback(async (offerId: number) => {
    if (!isLoggedIn) throw new Error('Not logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const transaction = await apiService.confirmOffer(offerId);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept offer';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch offers on login
  useEffect(() => {
    if (isLoggedIn && tokenLogin?.nativeAuthToken) {
      fetchOffers();
    }
  }, [isLoggedIn, tokenLogin?.nativeAuthToken, fetchOffers]);

  return {
    createdOffers,
    receivedOffers,
    loading,
    error,
    fetchOffers,
    createOffer,
    cancelOffer,
    acceptOffer,
  };
}
