import { useState } from 'react';
import { Transaction, Address } from '@multiversx/sdk-core';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react/loginInfo/useGetLoginInfo';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import { refreshAccount } from '@multiversx/sdk-dapp/out/utils/account/refreshAccount';
import './OfferCard.css';

interface Offer {
  offerID: number;
  creator: string;
  offeredPayment: {
    tokenIdentifier: string;
    nonce: number;
    amount: string;
  };
  acceptedPayment: {
    tokenIdentifier: string;
    nonce: number;
    amount: string;
  };
  acceptedAddress: string;
}

interface Props {
  offer: Offer;
  type: 'created' | 'received';
  currentAddress: string;
  onAction?: () => void;
}

export function OfferCard({ offer, type, currentAddress, onAction }: Props) {
  const { tokenLogin } = useGetLoginInfo();
  const { network } = useGetNetworkConfig();
  const { nonce } = useGetAccount();
  const [loading, setLoading] = useState(false);

  const formatAmount = (amount: string, decimals = 18) => {
    const value = Number(amount) / Math.pow(10, decimals);
    return value.toFixed(4);
  };

  const handleAction = async (action: 'cancel' | 'accept') => {
    if (!tokenLogin?.nativeAuthToken) return;
    
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const endpoint = action === 'cancel' ? 'cancel' : 'confirm';

      const response = await fetch(`${baseUrl}/escrow/offers/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenLogin.nativeAuthToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offerId: offer.offerID }),
      });

      if (!response.ok) throw new Error('Request failed');
      
      const txData = await response.json();
      console.log('Transaction Data from backend:', txData);

      // Refresh account to get latest nonce
      try {
        await refreshAccount();
      } catch (error) {
        console.warn('Failed to refresh account, proceeding with current nonce:', error);
      }
      
      const transaction = new Transaction({
        value: BigInt(txData.value || 0),
        receiver: Address.newFromBech32(txData.receiver),
        sender: Address.newFromBech32(currentAddress),
        gasLimit: BigInt(Number(txData.gasLimit) || 60000000),
        data: txData.data ? new Uint8Array(atob(txData.data).split('').map(c => c.charCodeAt(0))) : undefined,
        chainID: network.chainId,
        nonce: BigInt(nonce),
      });

      // Sign transaction with wallet provider
      const provider = getAccountProvider();
      const signedTransactions = await provider.signTransactions([transaction]);

      // Send signed transaction
      const transactionManager = TransactionManager.getInstance();
      await transactionManager.send(signedTransactions);

      // Wait for transaction to be processed (polling for ~15 seconds)
      for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 2500));
        await refreshAccount(); // Update balance
        await onAction?.();     // Update offers list
      }
    } catch (err) {
      console.error(`Error ${action}ing offer:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-card">
      <div className="offer-id">Offer #{offer.offerID}</div>
      
      {/* For received offers, flip perspective - show what the viewer would give/get */}
      <div className="offer-details">
        <div className="offer-side offering">
          <span className="label">{type === 'received' ? 'You Give' : 'Offering'}</span>
          <span className="token">{type === 'received' ? offer.acceptedPayment.tokenIdentifier : offer.offeredPayment.tokenIdentifier}</span>
          <span className="amount">{formatAmount(type === 'received' ? offer.acceptedPayment.amount : offer.offeredPayment.amount)}</span>
        </div>
        
        <div className="offer-arrow">→</div>
        
        <div className="offer-side receiving">
          <span className="label">{type === 'received' ? 'You Get' : 'Receiving'}</span>
          <span className="token">{type === 'received' ? offer.offeredPayment.tokenIdentifier : offer.acceptedPayment.tokenIdentifier}</span>
          <span className="amount">{formatAmount(type === 'received' ? offer.offeredPayment.amount : offer.acceptedPayment.amount)}</span>
        </div>
      </div>

      <div className="offer-parties">
        <span>Creator: {offer.creator.slice(0, 10)}...{offer.creator.slice(-6)}</span>
        <span>Recipient: {offer.acceptedAddress.slice(0, 10)}...{offer.acceptedAddress.slice(-6)}</span>
      </div>

      <div className="offer-actions">
        {type === 'created' && (
          <button 
            className="action-btn cancel"
            onClick={() => handleAction('cancel')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Cancel Offer'}
          </button>
        )}
        
        {type === 'received' && (
          <button 
            className="action-btn accept"
            onClick={() => handleAction('accept')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Accept Offer'}
          </button>
        )}
      </div>
    </div>
  );
}
