import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { InkflowProvider } from './contexts/InkflowContext.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import CodeExamples from './components/CodeExamples.jsx';
import Performance from './components/Performance.jsx';
import TryOnline from './components/TryOnline.jsx';
import DancingCharacters from './components/DancingCharacters.jsx';
import CommentsReviews from './components/CommentsReviews.jsx';
import Download from './components/Download.jsx';
import Documentation from './components/Documentation.jsx';
import ApiDocs from './components/ApiDocs.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import Footer from './components/Footer.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import AnimatedLanding from './components/AnimatedLanding.jsx';
import TricaMusic from './components/TricaMusic.jsx';
import { testInkflowEndpoints } from './utils/inkflowTest.js';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLandingComplete = () => {
    setShowLanding(false);
    // Test INKFLOW endpoints when app loads
    if (typeof window !== 'undefined') {
      window.testInkflowEndpoints = testInkflowEndpoints;
      console.log('🧪 INKFLOW test function available: window.testInkflowEndpoints()');
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (showLanding) {
    return <AnimatedLanding onEnter={handleLandingComplete} />;
  }

  return (
    <InkflowProvider apiKey="ik_RcpjFTsCE2pFbrU5QAUPg8l5lLRQBb">
      <AuthProvider>
        <Router>
          <div className="App">
            <AnnouncementBanner />
            <ParticleBackground />
            <Header />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                  <CodeExamples />
                  <Performance />
                  <TryOnline />
                  <DancingCharacters />
                  <CommentsReviews />
                  <Download />
                </>
              } />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api" element={<ApiDocs />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
            <Footer />
            <TricaMusic />
          </div>
        </Router>
      </AuthProvider>
    </InkflowProvider>
  );
}

export default App;
