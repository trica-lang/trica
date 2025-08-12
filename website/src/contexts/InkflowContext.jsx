import React, { useState, useEffect, createContext, useContext } from 'react';
import { loginToInkflow, verifyInkflowSession, createInkflowContent } from '../lib/inkflow';

// Create Inkflow Context
const InkflowContext = createContext();

export const InkflowProvider = ({ children, apiKey }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (userId, email, displayName) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 InkflowProvider: Logging in user:', { userId, email, displayName });
      
      const user = await loginToInkflow(userId, email, displayName);
      setUser(user);
      console.log('✅ InkflowProvider: Login successful:', user);
      return user;
    } catch (error) {
      console.error('❌ InkflowProvider: Login failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🔄 InkflowProvider: Logging out user');
    localStorage.removeItem('inkflow_session');
    localStorage.removeItem('inkflow_user');
    localStorage.removeItem('inkflow_user_id');
    setUser(null);
    setError(null);
    console.log('✅ InkflowProvider: Logout successful');
  };

  const verifySession = async () => {
    try {
      setLoading(true);
      console.log('🔄 InkflowProvider: Verifying session');
      
      const user = await verifyInkflowSession();
      setUser(user);
      
      if (user) {
        console.log('✅ InkflowProvider: Session verified:', user);
      } else {
        console.log('ℹ️ InkflowProvider: No valid session found');
      }
    } catch (error) {
      console.error('❌ InkflowProvider: Session verification failed:', error);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (contentData) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save content');
      }

      console.log('🔄 InkflowProvider: Saving content:', contentData);
      const result = await createInkflowContent(contentData);
      console.log('✅ InkflowProvider: Content saved:', result);
      return result;
    } catch (error) {
      console.error('❌ InkflowProvider: Content save failed:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    verifySession();
  }, []);

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    saveContent,
    clearError,
    isAuthenticated: !!user,
    // Additional helper methods
    getUserId: () => user?.external_user_id || user?.id,
    getUserEmail: () => user?.email,
    getUserDisplayName: () => user?.display_name,
    // Session info
    hasValidSession: () => !!localStorage.getItem('inkflow_session'),
    getSessionToken: () => localStorage.getItem('inkflow_session')
  };

  return (
    <InkflowContext.Provider value={contextValue}>
      {children}
    </InkflowContext.Provider>
  );
};

export const useInkflow = () => {
  const context = useContext(InkflowContext);
  if (!context) {
    throw new Error('useInkflow must be used within InkflowProvider');
  }
  return context;
};

// Higher-order component for components that require authentication
export const withInkflowAuth = (Component) => {
  return function InkflowAuthComponent(props) {
    const { isAuthenticated, loading } = useInkflow();
    
    if (loading) {
      return <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <div className="text-center p-4 text-gray-600">
        Please log in to access this feature.
      </div>;
    }
    
    return <Component {...props} />;
  };
};

// Hook for components that need to save content
export const useInkflowContent = () => {
  const { saveContent, isAuthenticated, user } = useInkflow();
  
  const saveToInkflow = async (title, content, metadata = {}) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to save content');
    }
    
    return await saveContent({
      title,
      body: content,
      type: 'trica-code',
      metadata: {
        ...metadata,
        source: 'trica',
        user_id: user?.external_user_id || user?.id,
        timestamp: new Date().toISOString()
      }
    });
  };
  
  return {
    saveToInkflow,
    canSave: isAuthenticated,
    user
  };
};

export default InkflowProvider;