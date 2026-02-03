import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { useGetAccount } from '@multiversx/sdk-dapp/out/react/account/useGetAccount';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers';
import { TokensModal } from '../wallet/TokensModal';
import './Header.css';

export function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useGetIsLoggedIn();
  const { address, balance } = useGetAccount();
  const [showTokensModal, setShowTokensModal] = useState(false);

  const handleConnect = () => {
    const unlockPanelManager = UnlockPanelManager.init({
      loginHandler: () => {
        navigate('/dashboard');
      },
      onClose: () => {}
    });

    unlockPanelManager.openUnlockPanel();
  };

  const handleLogout = async () => {
    const provider = getAccountProvider();
    if (provider && typeof provider.logout === 'function') {
      await provider.logout();
    }
    navigate('/');
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    if (!bal) return '0';
    return (Number(bal) / 1e18).toFixed(2);
  };



  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">Escrow</span>
          </Link>

          <nav className="nav"></nav>

          <div className="header-right">
            {isLoggedIn ? (
              <div className="wallet-info">
                <span className="balance">{formatBalance(balance)} EGLD</span>
                <button 
                  className="address-btn" 
                  onClick={() => setShowTokensModal(true)}
                  title="View token holdings"
                >
                  {shortenAddress(address)}
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button className="connect-btn" onClick={handleConnect}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {showTokensModal && (
        <TokensModal 
          address={address} 
          onClose={() => setShowTokensModal(false)} 
        />
      )}
    </>
  );
}
