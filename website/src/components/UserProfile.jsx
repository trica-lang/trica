import React, { useState } from 'react';
import { User, Crown, Star, LogOut, Settings, Brain, Zap, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, signOut, isVerifiedUser, isPremiumUser, getUserDisplayName, getUserAvatar } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserStats = () => {
    // Mock user stats - in real app, fetch from database
    return {
      mindDestructionLevel: isPremiumUser() ? 'INFINITE' : 'MODERATE',
      reviewsSubmitted: Math.floor(Math.random() * 10) + 1,
      danceMovesUnlocked: isPremiumUser() ? 8 : 4,
      codeExamplesAccessed: isPremiumUser() ? 25 : 12,
      timeSpentInREPL: `${Math.floor(Math.random() * 120) + 30} minutes`,
      favoriteFeature: 'Dancing Characters'
    };
  };

  const stats = getUserStats();

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src={getUserAvatar()} 
              alt={getUserDisplayName()}
              className="profile-avatar"
            />
            {isVerifiedUser() && (
              <div className="verified-crown">
                <Crown size={16} />
              </div>
            )}
            {isPremiumUser() && (
              <div className="premium-glow"></div>
            )}
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">
              {getUserDisplayName()}
              {isVerifiedUser() && <Shield className="verified-icon" size={16} />}
            </h2>
            <p className="profile-email">{user.email}</p>
            
            <div className="profile-badges">
              {isPremiumUser() && (
                <div className="badge premium-badge">
                  <Star size={12} />
                  Premium User
                </div>
              )}
              {isVerifiedUser() && (
                <div className="badge verified-badge">
                  <Crown size={12} />
                  Verified
                </div>
              )}
              <div className="badge mind-badge">
                <Brain size={12} />
                Mind Destroyed
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="stats-section">
            <h3>🧠 Mind Destruction Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Brain size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Destruction Level</span>
                  <span className="stat-value">{stats.mindDestructionLevel}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Star size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Reviews Submitted</span>
                  <span className="stat-value">{stats.reviewsSubmitted}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Sparkles size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Dance Moves</span>
                  <span className="stat-value">{stats.danceMovesUnlocked}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Zap size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Code Examples</span>
                  <span className="stat-value">{stats.codeExamplesAccessed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="achievements-section">
            <h3>🏆 Achievements Unlocked</h3>
            <div className="achievements-grid">
              <div className="achievement-item unlocked">
                <Brain className="achievement-icon" />
                <div className="achievement-info">
                  <span className="achievement-name">First Mind Destruction</span>
                  <span className="achievement-desc">Experienced Trica for the first time</span>
                </div>
              </div>
              
              <div className="achievement-item unlocked">
                <Sparkles className="achievement-icon" />
                <div className="achievement-info">
                  <span className="achievement-name">Dance Party Participant</span>
                  <span className="achievement-desc">Watched the dancing characters</span>
                </div>
              </div>
              
              <div className={`achievement-item ${isPremiumUser() ? 'unlocked' : 'locked'}`}>
                <Crown className="achievement-icon" />
                <div className="achievement-info">
                  <span className="achievement-name">Premium Explorer</span>
                  <span className="achievement-desc">Unlocked premium features</span>
                </div>
              </div>
              
              <div className={`achievement-item ${isVerifiedUser() ? 'unlocked' : 'locked'}`}>
                <Shield className="achievement-icon" />
                <div className="achievement-info">
                  <span className="achievement-name">Verified Developer</span>
                  <span className="achievement-desc">Verified account status</span>
                </div>
              </div>
            </div>
          </div>

          {isPremiumUser() && (
            <div className="premium-section">
              <h3>⭐ Premium Features Active</h3>
              <div className="premium-features-list">
                <div className="premium-feature">
                  <Zap className="feature-icon" />
                  <span>Priority REPL Access</span>
                </div>
                <div className="premium-feature">
                  <Brain className="feature-icon" />
                  <span>Advanced Mind Destruction</span>
                </div>
                <div className="premium-feature">
                  <Sparkles className="feature-icon" />
                  <span>Exclusive Dance Moves</span>
                </div>
                <div className="premium-feature">
                  <Crown className="feature-icon" />
                  <span>Verified Badge</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="action-btn settings-btn">
            <Settings size={16} />
            Settings
          </button>
          
          <button 
            className="action-btn logout-btn"
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <div className="spinner"></div>
            ) : (
              <LogOut size={16} />
            )}
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;