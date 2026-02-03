import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>EnRich Escrow Tutorial - MultiversX Devnet</p>
        <span className="footer-separator">|</span>
        <p className="footer-links">
          <a href="https://x.com/MeetEnRich" target="_blank" rel="noopener">
            EnRich on X
          </a>
          <span>•</span>
          <a href="https://devnet-explorer.multiversx.com" target="_blank" rel="noopener">
            Explorer
          </a>
          <span>•</span>
          <a href="https://docs.multiversx.com" target="_blank" rel="noopener">
            Docs
          </a>
        </p>
      </div>
    </footer>
  );
}
