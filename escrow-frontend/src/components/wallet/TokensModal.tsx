import { useState, useEffect } from 'react';
import './TokensModal.css';

interface Token {
  identifier: string;
  name: string;
  balance: string;
  decimals: number;
  ticker: string;
}

interface Props {
  address: string;
  nativeBalance: string;
  onClose: () => void;
}

export function TokensModal({ address, nativeBalance, onClose }: Props) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `https://devnet-api.multiversx.com/accounts/${address}/tokens`
        );
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const data = await response.json();
        setTokens(data);
      } catch (err) {
        setError('Could not load tokens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address]);

  const formatBalance = (balance: string, decimals: number) => {
    const value = Number(balance) / Math.pow(10, decimals);
    if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(2) + 'K';
    return value.toFixed(decimals > 4 ? 4 : decimals);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="tokens-modal-backdrop" onClick={handleBackdropClick}>
      <div className="tokens-modal">
        <div className="modal-header">
          <h2>Wallet Assets</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="native-balance-section">
            <div className="token-info">
                <span className="token-name">MultiversX</span>
                <span className="token-id">xEGLD</span>
            </div>
            <div className="token-balance highlight">
                {formatBalance(nativeBalance, 18)}
            </div>
        </div>

        <div className="address-display">
          <span>{address.slice(0, 12)}...{address.slice(-8)}</span>
          <a 
            href={`https://devnet-explorer.multiversx.com/accounts/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View in Explorer
          </a>
        </div>

        <div className="tokens-list">
          {loading && <div className="loading">Loading tokens...</div>}
          
          {error && <div className="error">{error}</div>}
          
          {!loading && !error && tokens.length === 0 && (
            <div className="empty">No ESDT tokens found</div>
          )}

          {tokens.map((token) => (
            <div key={token.identifier} className="token-row">
              <div className="token-info">
                <span className="token-name">{token.name || token.ticker}</span>
                <span className="token-id">{token.identifier}</span>
              </div>
              <div className="token-balance">
                {formatBalance(token.balance, token.decimals)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
