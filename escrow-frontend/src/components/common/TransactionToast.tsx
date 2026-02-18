import './TransactionToast.css';

interface TransactionToastProps {
  title: string;
  txHash: string;
}

export const TransactionToast = ({ title, txHash }: TransactionToastProps) => {
  const explorerUrl = `https://devnet-explorer.multiversx.com/transactions/${txHash}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(txHash);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="transaction-toast-content">
      <div className="toast-title">{title}</div>
      <div className="toast-hash-row">
        <span className="hash-label">Hash:</span>
        <span className="hash-value">{txHash.slice(0, 8)}...{txHash.slice(-8)}</span>
        <button className="copy-btn" onClick={handleCopy} title="Copy Hash">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <a 
        href={explorerUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="explorer-link"
        onClick={handleLinkClick}
      >
        View on Explorer 
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  );
};
