import { useNavigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = useGetIsLoggedIn();

  const handleConnect = () => {
    const unlockPanelManager = UnlockPanelManager.init({
      loginHandler: () => {
        navigate('/dashboard');
      },
      onClose: () => {}
    });

    unlockPanelManager.openUnlockPanel();
  };

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Decentralized</span> Escrow
            <br />
            on MultiversX
          </h1>
          <p className="hero-description">
            Create trustless peer-to-peer token swaps with our secure escrow smart contract.
            Trade ESDT tokens safely without intermediaries.
          </p>
          
          {isLoggedIn ? (
            <button className="hero-button" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <button className="hero-button" onClick={handleConnect}>
              Connect Wallet
            </button>
          )}
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-text">Secure</span>
          </div>
          <div className="floating-card card-2">
            <span className="card-text">Fast</span>
          </div>
          <div className="floating-card card-3">
            <span className="card-text">Trustless</span>
          </div>
        </div>
      </div>
    </div>
  );
}
