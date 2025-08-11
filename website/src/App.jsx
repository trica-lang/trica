import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
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
import AuthCallback from './components/AuthCallback.jsx';
import Footer from './components/Footer.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import AnimatedLanding from './components/AnimatedLanding.jsx';
import TricaMusic from './components/TricaMusic.jsx';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLandingComplete = () => {
    setShowLanding(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (showLanding) {
    return <AnimatedLanding onEnter={handleLandingComplete} />;
  }

  return (
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
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
          <Footer />
          <TricaMusic />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
