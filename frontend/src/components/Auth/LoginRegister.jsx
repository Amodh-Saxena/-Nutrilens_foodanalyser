import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import './Auth.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };
      
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          name: data.name || (isLogin ? data.user?.name : formData.name), 
          email: data.email || formData.email,
          profileComplete: data.profileComplete
        }));
        // Navigate based on profile status
        if (data.profileComplete) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/onboarding';
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Server Connection Error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <motion.div 
        className="auth-panel"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
           <motion.div 
             whileHover={{ rotate: 10, scale: 1.1 }}
             style={{ 
               background: '#F4C400', 
               padding: '1.2rem', 
               borderRadius: '50%',
               border: '3px solid #1A1A1A',
               boxShadow: '4px 4px 0px #1A1A1A'
             }}
           >
              <UserCircle size={44} color="#1A1A1A" strokeWidth={2.5} />
           </motion.div>
        </div>

        <h2>{isLogin ? 'Welcome Back!' : 'Join NutriLens'}</h2>
        <p className="subtitle">
          {isLogin ? 'Sign in to monitor your health telemetry.' : 'Start your journey to metabolic transparency.'}
        </p>
        
        {error && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              color: '#FF3A3A', 
              background: 'rgba(255, 58, 58, 0.08)',
              border: '2px solid #FF3A3A',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                className="input-field" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              placeholder="hello@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <label>Secure Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <motion.button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }} 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In Now' : 'Create My Account')}
          </motion.button>
        </form>

        <div className="toggle-mode">
          {isLogin ? "New to NutriLens?" : "Already have an account?"} 
          <span onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? 'Join Here' : 'Log In'}
          </span>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '2px solid #ECECEC', paddingTop: '1.5rem' }}>
           <button 
             className="btn btn-outline" 
             style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem', borderRadius: '50px' }} 
             onClick={() => navigate('/scan')}
           >
             Quick Scan (Guest)
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegister;
