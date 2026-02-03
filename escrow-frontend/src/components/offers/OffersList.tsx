import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
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
    cancelOffer: cancelOfferApi,
    acceptOffer: acceptOfferApi,
    fetchOffers
  } = useOffers();
  const { network } = useGetNetworkConfig();
  const { address: senderAddress } = useGetAccount();

  const offers = type === 'created' ? createdOffers : receivedOffers;

  const handleTransaction = async (
    apiCall: () => Promise<any>, 
    displayInfo: { processing: string; success: string; error: string }
  ) => {
    try {
      const txResponse = await apiCall();
      
      await sendTransactions({
        transactions: [{
          value: txResponse.value || '0',
          receiver: txResponse.receiver,
          sender: senderAddress,
          gasLimit: txResponse.gasLimit || 20000000,
          data: txResponse.data,
          chainID: network.chainId,
        }],
        transactionsDisplayInfo: {
          processingMessage: displayInfo.processing,
          successMessage: displayInfo.success,
          errorMessage: displayInfo.error,
        },
      });

      // Refresh offers list after transaction
      setTimeout(() => fetchOffers(), 3000);
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const handleCancel = (offerId: number) => {
    handleTransaction(
      () => cancelOfferApi(offerId),
      {
        processing: 'Cancelling offer...',
        success: 'Offer cancelled successfully!',
        error: 'Failed to cancel offer'
      }
    );
  };

  const handleAccept = (offerId: number) => {
    handleTransaction(
      () => acceptOfferApi(offerId),
      {
        processing: 'Accepting offer...',
        success: 'Offer accepted successfully!',
        error: 'Failed to accept offer'
      }
    );
  };

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
            onCancel={type === 'created' ? handleCancel : undefined}
            onAccept={type === 'received' ? handleAccept : undefined}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
