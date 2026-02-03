import { useNavigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/out/react/account/useGetIsLoggedIn';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers';
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import './ConnectButton.css';

export function ConnectButton() {
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

  const handleLogout = async () => {
    try {
      const provider = getAccountProvider();
      if (provider && typeof provider.logout === 'function') {
        await provider.logout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <button className="connect-button disconnect" onClick={handleLogout}>
        Disconnect
      </button>
    );
  }

  return (
    <button className="connect-button" onClick={handleConnect}>
      Connect Wallet
    </button>
  );
}
