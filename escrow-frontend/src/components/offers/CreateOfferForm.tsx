import { useState } from 'react';
import { Transaction, Address } from '@multiversx/sdk-core';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react/loginInfo/useGetLoginInfo';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';
import './CreateOfferForm.css';

interface Props {
  onSuccess?: () => void;
}

export function CreateOfferForm({ onSuccess }: Props) {
  const { address, nonce } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { network } = useGetNetworkConfig();

  const [formData, setFormData] = useState({
    offeredToken: 'WEGLD-bd4d79',
    offeredNonce: '0',
    offeredAmount: '',
    acceptedToken: 'USDC-c76f1f',
    acceptedNonce: '0',
    acceptedAmount: '',
    acceptedAddress: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.offeredToken.trim()) { setError('Enter offered token ID'); return; }
    if (!formData.offeredAmount || parseFloat(formData.offeredAmount) <= 0) { setError('Enter valid offered amount'); return; }
    if (!formData.acceptedToken.trim()) { setError('Enter accepted token ID'); return; }
    if (!formData.acceptedAmount || parseFloat(formData.acceptedAmount) <= 0) { setError('Enter valid accepted amount'); return; }
    if (!formData.acceptedAddress || !formData.acceptedAddress.startsWith('erd1')) { setError('Enter valid recipient address'); return; }

    setIsSubmitting(true);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const offeredAmountWei = (parseFloat(formData.offeredAmount) * 1e18).toString();
      const acceptedAmountWei = (parseFloat(formData.acceptedAmount) * 1e18).toString();

      const response = await fetch(`${baseUrl}/escrow/offers/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenLogin?.nativeAuthToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offeredToken: formData.offeredToken,
          offeredNonce: parseInt(formData.offeredNonce) || 0,
          offeredAmount: offeredAmountWei,
          acceptedToken: formData.acceptedToken,
          acceptedNonce: parseInt(formData.acceptedNonce) || 0,
          acceptedAmount: acceptedAmountWei,
          acceptedAddress: formData.acceptedAddress,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error('Backend request failed');
      }
      const txData = await response.json();
      console.log('Transaction from backend:', txData);

      const transaction = new Transaction({
        value: BigInt(txData.value || 0),
        receiver: Address.newFromBech32(txData.receiver),
        sender: Address.newFromBech32(address),
        gasLimit: BigInt(Number(txData.gasLimit) || 20000000),
        data: txData.data ? new Uint8Array(atob(txData.data).split('').map(c => c.charCodeAt(0))) : undefined,
        chainID: network.chainId,
        nonce: BigInt(nonce),
      });

      const transactionManager = TransactionManager.getInstance();
      await transactionManager.send([transaction]);

      setFormData({
        offeredToken: 'WEGLD-bd4d79',
        offeredNonce: '0',
        offeredAmount: '',
        acceptedToken: 'USDC-c76f1f',
        acceptedNonce: '0',
        acceptedAmount: '',
        acceptedAddress: '',
      });

      setTimeout(() => onSuccess?.(), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-offer-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-grid">
        <div className="form-section">
          <h3>Offering</h3>
          <div className="compact-row">
            <div className="field">
              <label>Token ID</label>
              <input type="text" value={formData.offeredToken} onChange={(e) => handleChange('offeredToken', e.target.value)} />
            </div>
            <div className="field nonce-field">
              <label>Nonce</label>
              <input type="number" min="0" value={formData.offeredNonce} onChange={(e) => handleChange('offeredNonce', e.target.value)} />
            </div>
            <div className="field">
              <label>Amount</label>
              <input type="number" step="any" min="0" placeholder="0.00" value={formData.offeredAmount} onChange={(e) => handleChange('offeredAmount', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="swap-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8" />
            <path d="M17 8V20M17 20L21 16M17 20L13 16" />
          </svg>
        </div>

        <div className="form-section">
          <h3>Receiving</h3>
          <div className="compact-row">
            <div className="field">
              <label>Token ID</label>
              <input type="text" value={formData.acceptedToken} onChange={(e) => handleChange('acceptedToken', e.target.value)} />
            </div>
            <div className="field nonce-field">
              <label>Nonce</label>
              <input type="number" min="0" value={formData.acceptedNonce} onChange={(e) => handleChange('acceptedNonce', e.target.value)} />
            </div>
            <div className="field">
              <label>Amount</label>
              <input type="number" step="any" min="0" placeholder="0.00" value={formData.acceptedAmount} onChange={(e) => handleChange('acceptedAmount', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="field">
            <label>Recipient Address</label>
            <input type="text" placeholder="erd1..." value={formData.acceptedAddress} onChange={(e) => handleChange('acceptedAddress', e.target.value)} />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Offer'}
      </button>
    </form>
  );
}
