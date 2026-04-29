import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  return (
    <nav className="top-navbar">
      {/* Brand */}
      <div className="brand" onClick={() => navigate('/')}>
        🔬 NutriLens
        <span className="brand-dot" />
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        {!token ? (
          <button
            id="nav-login-btn"
            className="nav-btn-cta"
            onClick={() => navigate('/auth')}
          >
            Get Started →
          </button>
        ) : (
          <>
            <button
              id="nav-scan-btn"
              className="nav-btn"
              onClick={() => navigate('/scan')}
            >
              🔍 Scanner
            </button>

            <button
              id="nav-dashboard-btn"
              className="nav-btn"
              onClick={() => navigate('/dashboard')}
            >
              📊 Dashboard
            </button>

            <button
              id="nav-guide-btn"
              className="nav-btn"
              onClick={() => navigate('/guide')}
            >
              📖 Guide
            </button>

            {location.pathname === '/dashboard' && (
              <button
                id="nav-formulas-btn"
                className="nav-btn"
                onClick={() => navigate('/formulas')}
              >
                🧪 Formulas
              </button>
            )}

            <button
              id="nav-logout-btn"
              className="nav-btn-danger"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/auth');
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
