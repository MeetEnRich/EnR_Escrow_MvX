import { useState, useEffect, useCallback } from 'react';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/out/react/loginInfo/useGetLoginInfo';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { CreateOfferForm } from '../components/offers/CreateOfferForm';
import { OfferCard } from '../components/offers/OfferCard';
import './DashboardPage.css';

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

export function DashboardPage() {
  const { tokenLogin } = useGetLoginInfo();
  const { address } = useGetAccount();
  const [activeTab, setActiveTab] = useState<'create' | 'myOffers' | 'received'>('create');
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!tokenLogin?.nativeAuthToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const headers = {
        'Authorization': `Bearer ${tokenLogin.nativeAuthToken}`,
        'Content-Type': 'application/json',
      };

      const [createdRes, receivedRes] = await Promise.all([
        fetch(`${baseUrl}/escrow/offers/created`, { headers }),
        fetch(`${baseUrl}/escrow/offers/received`, { headers }),
      ]);

      if (createdRes.ok) {
        const data = await createdRes.json();
        setMyOffers(data);
      }
      
      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReceivedOffers(data);
      }
    } catch (err) {
      console.error('Fetch offers error:', err);
      setError('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  }, [tokenLogin?.nativeAuthToken]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="refresh-btn" onClick={fetchOffers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Offer
          </button>
          <button 
            className={`tab ${activeTab === 'myOffers' ? 'active' : ''}`}
            onClick={() => setActiveTab('myOffers')}
          >
            My Offers ({myOffers.length})
          </button>
          <button 
            className={`tab ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received ({receivedOffers.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'create' && (
            <CreateOfferForm onSuccess={fetchOffers} />
          )}

          {activeTab === 'myOffers' && (
            <div className="offers-list">
              {error && <div className="error-message">{error}</div>}
              {myOffers.length === 0 && !loading && (
                <div className="empty-state">No offers created yet</div>
              )}
              {myOffers.map(offer => (
                <OfferCard 
                  key={offer.offerID} 
                  offer={offer} 
                  type="created"
                  currentAddress={address}
                  onAction={fetchOffers}
                />
              ))}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="offers-list">
              {error && <div className="error-message">{error}</div>}
              {receivedOffers.length === 0 && !loading && (
                <div className="empty-state">No offers received yet</div>
              )}
              {receivedOffers.map(offer => (
                <OfferCard 
                  key={offer.offerID} 
                  offer={offer} 
                  type="received"
                  currentAddress={address}
                  onAction={fetchOffers}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
