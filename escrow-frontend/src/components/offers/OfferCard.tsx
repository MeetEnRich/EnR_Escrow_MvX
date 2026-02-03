import { useState } from 'react';
import { Transaction, Address } from '@multiversx/sdk-core';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react/loginInfo/useGetLoginInfo';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';
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
      
      const transaction = new Transaction({
        value: BigInt(txData.value || 0),
        receiver: Address.newFromBech32(txData.receiver),
        sender: Address.newFromBech32(currentAddress),
        gasLimit: BigInt(Number(txData.gasLimit) || 20000000),
        data: txData.data ? new Uint8Array(atob(txData.data).split('').map(c => c.charCodeAt(0))) : undefined,
        chainID: network.chainId,
        nonce: BigInt(nonce),
      });

      const transactionManager = TransactionManager.getInstance();
      await transactionManager.send([transaction]);

      setTimeout(() => onAction?.(), 3000);
    } catch (err) {
      console.error(`Error ${action}ing offer:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-card">
      <div className="offer-id">Offer #{offer.offerID}</div>
      
      <div className="offer-details">
        <div className="offer-side">
          <span className="label">Offering</span>
          <span className="token">{offer.offeredPayment.tokenIdentifier}</span>
          <span className="amount">{formatAmount(offer.offeredPayment.amount)}</span>
        </div>
        
        <div className="offer-arrow">→</div>
        
        <div className="offer-side">
          <span className="label">Receiving</span>
          <span className="token">{offer.acceptedPayment.tokenIdentifier}</span>
          <span className="amount">{formatAmount(offer.acceptedPayment.amount)}</span>
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
