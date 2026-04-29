import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AnimatedStory from './components/AnimatedStory';
import StoryFlow from './components/StoryFlow';
import LoginRegister from './components/Auth/LoginRegister';
import TopNav from './components/TopNav';
import UserDashboard from './components/Dashboard/UserDashboard';
import Onboarding from './components/Onboarding/Onboarding';
import FormulaGuide from './components/Dashboard/FormulaGuide';
import IngredientLogView from './components/IngredientLogView';
import V2Scanner from './components/V2Scanner';
import UserGuide from './components/UserGuide';

function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}')
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || '{}')
      });
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, [location]);

  const isAuthenticated = !!authState.token;
  const isProfileComplete = authState.user && authState.user.profileComplete;

  return (
    <>
      <div className="cinematic-bg"></div>
      <div className="app-container">
        <TopNav />
        <Routes>
        <Route path="/auth" element={<LoginRegister />} />
        
        <Route 
          path="/onboarding" 
          element={isAuthenticated ? <Onboarding /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/dashboard" 
          element={isAuthenticated ? (isProfileComplete ? <UserDashboard /> : <Navigate to="/onboarding" />) : <Navigate to="/auth" />} 
        />
        
        <Route 
          path="/" 
          element={<AnimatedStory onComplete={() => navigate(isAuthenticated ? '/scan' : '/auth')} />} 
        />

        <Route 
          path="/scan" 
          element={isAuthenticated ? <V2Scanner /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/formulas" 
          element={isAuthenticated ? <FormulaGuide /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/logs" 
          element={isAuthenticated ? <IngredientLogView /> : <Navigate to="/auth" />} 
        />

        <Route 
          path="/guide" 
          element={isAuthenticated ? <UserGuide /> : <Navigate to="/auth" />} 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </>
  );
}

export default App;