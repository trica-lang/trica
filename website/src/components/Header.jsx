

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download as DownloadIcon, Book, Github, X, Menu, User, Crown, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const location = useLocation();
  const { user, loading, isVerifiedUser, isPremiumUser, getUserDisplayName, getUserAvatar } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-text">
              <span className="text-gradient">Trica</span>
            </span>
            <span className="logo-tagline">Ultra-Fast</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <a 
              href="#features" 
              className="nav-link"
              onClick={closeMenu}
            >
              Features
            </a>
            <a 
              href="#examples" 
              className="nav-link"
              onClick={closeMenu}
            >
              Examples
            </a>
            <a 
              href="#try-online" 
              className="nav-link"
              onClick={closeMenu}
            >
              Try Online
            </a>
            <a 
              href="#dancing-characters" 
              className="nav-link"
              onClick={closeMenu}
            >
              🎵 Dance Party
            </a>
            <a 
              href="#reviews" 
              className="nav-link"
              onClick={closeMenu}
            >
              💬 Reviews
            </a>
            <Link 
              to="/docs" 
              className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Book size={16} />
              Docs
            </Link>
            <a 
              href="https://github.com/trica-lang/trica" 
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <Github size={16} />
              GitHub
            </a>
          </nav>

          <div className="header-actions">
            {!loading && (
              <>
                {user ? (
                  <button 
                    className="user-btn"
                    onClick={() => setShowUserProfile(true)}
                  >
                    <img 
                      src={getUserAvatar()} 
                      alt={getUserDisplayName()}
                      className="user-avatar"
                    />
                    <span className="user-name">{getUserDisplayName()}</span>
                    {isVerifiedUser() && <Crown className="crown-icon" size={14} />}
                  </button>
                ) : (
                  <button 
                    className="auth-btn"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                )}
              </>
            )}
            
            <a 
              href="#download" 
              className="btn btn-primary"
            >
              <DownloadIcon size={16} />
              Download
            </a>
            
            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="logo-text text-gradient">Trica</span>
              <button onClick={closeMenu}>
                <X size={24} />
              </button>
            </div>
            <nav className="mobile-nav">
              <Link to="/" onClick={closeMenu}>Home</Link>
              <a href="#features" onClick={closeMenu}>Features</a>
              <a href="#examples" onClick={closeMenu}>Examples</a>
              <Link to="/docs" onClick={closeMenu}>Documentation</Link>
              <a 
                href="https://github.com/trica-lang/trica" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                GitHub
              </a>
              <a href="#download" className="btn btn-primary" onClick={closeMenu}>
                <DownloadIcon size={16} />
                Download
              </a>
            </nav>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </header>
  );
};

export default Header;





