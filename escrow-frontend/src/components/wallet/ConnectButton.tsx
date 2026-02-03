import { useNavigate } from 'react-router-dom';
import { ExtensionLoginButton, WebWalletLoginButton, WalletConnectLoginButton } from '@multiversx/sdk-dapp/UI';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { logout } from '@multiversx/sdk-dapp/utils';
import './ConnectButton.css';

export function ConnectButton() {
  const navigate = useNavigate();
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const commonProps = {
    callbackRoute: '/dashboard',
    nativeAuth: true,
  };

  if (isLoggedIn) {
    return (
      <button className="connect-button disconnect" onClick={handleLogout}>
        Disconnect
      </button>
    );
  }

  return (
    <div className="wallet-buttons">
      <ExtensionLoginButton
        loginButtonText="DeFi Wallet"
        {...commonProps}
      />
      <WebWalletLoginButton
        loginButtonText="Web Wallet"
        {...commonProps}
      />
      <WalletConnectLoginButton
        loginButtonText="xPortal"
        {...commonProps}
      />
    </div>
  );
}
