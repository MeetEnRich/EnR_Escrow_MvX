import { useGetAccount } from '@multiversx/sdk-dapp/hooks/account/useGetAccount';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { shortenAddress, formatAmount } from '../../utils/format';
import './WalletInfo.css';

export function WalletInfo() {
  const isLoggedIn = useGetIsLoggedIn();
  const { address, balance } = useGetAccount();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="wallet-info">
      <div className="wallet-address">
        <span className="label">Address:</span>
        <span className="value" title={address}>{shortenAddress(address, 8)}</span>
      </div>
      <div className="wallet-balance">
        <span className="label">Balance:</span>
        <span className="value">{formatAmount(balance || '0', 18)} EGLD</span>
      </div>
    </div>
  );
}
