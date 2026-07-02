'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <span className="logo-icon">▲</span>
          <span className="logo-text">Kuaiyou OS</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/docs" 
            className={`nav-link ${pathname === '/docs' ? 'active' : ''}`}
          >
            Docs
          </Link>
        </div>

        <div className="nav-actions">
          <a 
            href="https://github.com/ScottHughes6/kuaiyou-open-source" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-btn"
          >
            <span className="github-icon">⭐</span>
            Star on GitHub
          </a>
        </div>
      </div>

      
    </nav>
  );
}
