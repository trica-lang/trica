
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWindows, 
  FaLinux, 
  FaApple, 
  FaGithub
} from 'react-icons/fa';
import { 
  Download as DownloadIcon, 
  Book, 
  Code, 
  Zap, 
  Github, 
  Twitter, 
  Mail,
  Heart 
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Download', href: '#download', icon: <DownloadIcon size={14} /> },
      { name: 'Documentation', href: '/docs', icon: <Book size={14} /> },
      { name: 'Examples', href: '#examples', icon: <Code size={14} /> },
      { name: 'Performance', href: '#performance', icon: <Zap size={14} /> }
    ],
    community: [
      { name: 'GitHub', href: 'https://github.com/trica-lang/trica', icon: <Github size={14} /> },
      { name: 'Twitter', href: 'https://twitter.com/trica_lang', icon: <Twitter size={14} /> },
      { name: 'Discord', href: '#', icon: <Mail size={14} /> },
      { name: 'Reddit', href: '#', icon: <Mail size={14} /> }
    ],
    resources: [
      { name: 'Getting Started', href: '/docs#getting-started' },
      { name: 'Syntax Guide', href: '/docs#syntax' },
      { name: 'Advanced Features', href: '/docs#advanced' },
      { name: 'API Documentation', href: '/api' },
      { name: 'Compilation', href: '/docs#compilation' }
    ]
  };

  return (
    <footer className="footer">
      <div className="footer-bg">
        <div className="footer-particles"></div>
      </div>
      
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="logo-text text-gradient">Trica</span>
              <span className="logo-tagline">Ultra-Fast</span>
            </div>
            <p className="brand-description">
              The mind-bending programming language that will physically destroy your 
              understanding of computational complexity. Deceptively simple syntax 
              hiding infinite algorithmic depth.
            </p>
            <div className="social-links">
              <a 
                href="https://github.com/trica-lang/trica" 
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com/trica_lang" 
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="mailto:hello@trica.k2lang.org" 
                className="social-link"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-group-title">Product</h4>
              <ul className="link-list">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a href={link.href} className="footer-link">
                        {link.icon}
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="footer-link">
                        {link.icon}
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4 className="link-group-title">Community</h4>
              <ul className="link-list">
                {footerLinks.community.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="footer-link"
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      {link.icon}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4 className="link-group-title">Resources</h4>
              <ul className="link-list">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-stats">
          <div className="stat-item">
            <div className="stat-number text-gradient">∞</div>
            <div className="stat-label">Complexity Level</div>
          </div>
          <div className="stat-item">
            <div className="stat-number text-gradient-secondary">&lt;1μs</div>
            <div className="stat-label">Execution Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number text-gradient-accent">100%</div>
            <div className="stat-label">Mind Destruction</div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Trica Team. Made with{' '}
              <Heart size={14} className="heart-icon" />{' '}
              and infinite complexity.
            </p>
            <p className="footer-tagline">
              <span className="glitch" data-text="Prepare to have your mind destroyed">
                Prepare to have your mind destroyed
              </span>
            </p>
          </div>
          
          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <a href="#" className="legal-link">Terms of Service</a>
            <a href="#" className="legal-link">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





