import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Brain, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import './AuthCallback.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Auth callback error:', error);
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            setTimeout(() => navigate('/'), 3000);
            return;
          }

          if (data.user) {
            setStatus('success');
            setMessage(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`);
            
            // Redirect to home page after success
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
          }
        } else {
          // Handle magic link or other auth methods
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            setTimeout(() => navigate('/'), 3000);
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage(`Welcome back, ${data.session.user.user_metadata?.full_name || data.session.user.email}!`);
            setTimeout(() => navigate('/', { replace: true }), 2000);
          } else {
            setStatus('error');
            setMessage('No authentication session found.');
            setTimeout(() => navigate('/'), 3000);
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Something went wrong. Redirecting...');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback">
      <div className="auth-callback-container">
        <div className="auth-callback-content">
          {status === 'processing' && (
            <>
              <div className="auth-icon processing">
                <Brain className="brain-icon spinning" />
                <div className="mind-particles">
                  <Sparkles className="particle particle-1" />
                  <Sparkles className="particle particle-2" />
                  <Sparkles className="particle particle-3" />
                </div>
              </div>
              <h2>Destroying Your Mind...</h2>
              <p>Processing your authentication and preparing premium features...</p>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="auth-icon success">
                <CheckCircle className="success-icon" />
                <div className="success-glow"></div>
              </div>
              <h2>Mind Successfully Destroyed! 🧠💥</h2>
              <p>{message}</p>
              <div className="success-features">
                <div className="feature-unlock">
                  <Sparkles size={16} />
                  <span>Premium features unlocked!</span>
                </div>
                <div className="feature-unlock">
                  <Brain size={16} />
                  <span>Advanced mind destruction activated!</span>
                </div>
              </div>
              <p className="redirect-message">Redirecting you to the Trica experience...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="auth-icon error">
                <AlertCircle className="error-icon" />
              </div>
              <h2>Authentication Failed</h2>
              <p>{message}</p>
              <p className="redirect-message">Redirecting you back to try again...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;