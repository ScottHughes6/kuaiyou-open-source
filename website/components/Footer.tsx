import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-text">Kuaiyou OS Ecosystem</span>
          <p className="footer-desc">Building the Next-Gen Agentic UI Automation.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/ScottHughes6/kuaiyou-open-source" target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link href="/docs">Documentation</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Kuaiyou Master Team. Open Source Ecosystem.</p>
        <p>Not affiliated with the closed-source Kuaiyou Master App commercial product.</p>
      </div>

      
    </footer>
  );
}
