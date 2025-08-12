import React, { useState } from 'react';
import { X, Github, Chrome, Star, Crown, Zap, Brain, Sparkles, Lock, Mail, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithGitHub, signInWithEmail, signInWithInkflow } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('google');
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('github');
      await signInWithGitHub();
      onClose();
    } catch (error) {
      console.error('GitHub sign in error:', error);
      alert('Failed to sign in with GitHub. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProvider('email');
      await signInWithEmail(email);
      setEmailSent(true);
      alert('🎉 Magic link sent! Check your email to complete sign in.');
    } catch (error) {
      console.error('Email sign in error:', error);
      alert('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleInkflowSignIn = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('inkflow');
      await signInWithInkflow();
      alert('🎉 Successfully signed in with INKFLOW! Your content will be synced.');
      onClose();
    } catch (error) {
      console.error('INKFLOW OAuth sign in error:', error);
      alert('Failed to sign in with INKFLOW. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-hero">
            <div className="auth-icon">
              <Brain className="brain-icon" />
              <div className="mind-particles">
                <Sparkles className="particle particle-1" />
                <Zap className="particle particle-2" />
                <Star className="particle particle-3" />
              </div>
            </div>
            
            <h2>Join the Mind Destruction</h2>
            <p>
              Sign in to unlock <strong>exclusive Trica features</strong> and join the community 
              of developers whose minds have been <em>physically destroyed</em>!
            </p>
          </div>

          <div className="premium-features">
            <h3>🚀 Unlock Premium Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <Crown className="feature-icon premium" />
                <span>Verified Badge</span>
              </div>
              <div className="feature-item">
                <Zap className="feature-icon premium" />
                <span>Priority REPL Access</span>
              </div>
              <div className="feature-item">
                <Brain className="feature-icon premium" />
                <span>Advanced Mind Destruction</span>
              </div>
              <div className="feature-item">
                <Lock className="feature-icon premium" />
                <span>Secret Code Examples</span>
              </div>
              <div className="feature-item">
                <Sparkles className="feature-icon premium" />
                <span>Exclusive Dance Moves</span>
              </div>
              <div className="feature-item">
                <Star className="feature-icon premium" />
                <span>Beta Features Access</span>
              </div>
            </div>
          </div>

          <div className="auth-buttons">
            <button 
              className="auth-btn google-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {loadingProvider === 'google' ? (
                <div className="spinner"></div>
              ) : (
                <Chrome size={20} />
              )}
              <span>Continue with Google</span>
              <div className="btn-glow"></div>
            </button>

            <button 
              className="auth-btn github-btn"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
            >
              {loadingProvider === 'github' ? (
                <div className="spinner"></div>
              ) : (
                <Github size={20} />
              )}
              <span>Continue with GitHub</span>
              <div className="btn-glow"></div>
            </button>

            <button 
              className="auth-btn inkflow-btn"
              onClick={handleInkflowSignIn}
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '1px solid #667eea'
              }}
            >
              {loadingProvider === 'inkflow' ? (
                <div className="spinner"></div>
              ) : (
                <Edit3 size={20} />
              )}
              <span>Continue with INKFLOW</span>
              <div className="btn-glow"></div>
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleEmailSignIn} className="email-form">
              <div className="email-input-group">
                <Mail className="email-icon" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email for magic link"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  disabled={isLoading || emailSent}
                />
              </div>
              <button 
                type="submit"
                className="auth-btn email-btn"
                disabled={isLoading || emailSent}
              >
                {loadingProvider === 'email' ? (
                  <div className="spinner"></div>
                ) : emailSent ? (
                  <Mail size={20} />
                ) : (
                  <Mail size={20} />
                )}
                <span>{emailSent ? 'Magic Link Sent!' : 'Send Magic Link'}</span>
                <div className="btn-glow"></div>
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>
          </div>

          <div className="auth-benefits">
            <div className="benefit-card">
              <h4>🧠 Mind Destruction Tracking</h4>
              <p>Track your journey through infinite complexity with personalized statistics.</p>
            </div>
            
            <div className="benefit-card">
              <h4>🎵 Custom Dance Styles</h4>
              <p>Unlock exclusive dance moves for the dancing characters section.</p>
            </div>
            
            <div className="benefit-card">
              <h4>💻 Advanced REPL Features</h4>
              <p>Access secret Trica examples and advanced debugging tools.</p>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              By signing in, you agree to have your mind <strong>physically destroyed</strong> 
              by Trica's infinite complexity. Side effects may include: understanding the universe, 
              time travel, and spontaneous code generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;