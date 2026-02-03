import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { OfferCard } from './OfferCard';
import { useOffers } from '../../hooks/useOffers';
import './OffersList.css';

interface OffersListProps {
  type: 'created' | 'received';
}

export function OffersList({ type }: OffersListProps) {
  const { 
    createdOffers, 
    receivedOffers, 
    loading, 
    error, 
    fetchOffers
  } = useOffers();
  const { network: _network } = useGetNetworkConfig();
  const { address: currentAddress } = useGetAccount();

  const offers = type === 'created' ? createdOffers : receivedOffers;

  if (loading && offers.length === 0) {
    return (
      <div className="offers-list">
        <div className="offers-loading">
          <div className="loading-spinner"></div>
          <p>Loading offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-list">
        <div className="offers-error">
          <p>{error}</p>
          <button onClick={fetchOffers}>Try Again</button>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="offers-list">
        <div className="offers-empty">
          <p>
            {type === 'created' 
              ? "You haven't created any offers yet."
              : "No offers have been sent to you."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-list">
      <div className="offers-grid">
        {offers.map(offer => (
          <OfferCard
            key={offer.offerID}
            offer={offer}
            type={type}
            currentAddress={currentAddress}
            onAction={fetchOffers}
          />
        ))}
      </div>
    </div>
  );
}
