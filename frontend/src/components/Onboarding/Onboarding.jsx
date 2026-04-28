import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Activity, Heart, Ruler } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    weight: '',
    height: '',
    healthIssues: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.username,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          healthIssues: formData.healthIssues
        })
      });

      const data = await res.json();
      if (data.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, ...data.data, profileComplete: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Profile update failed');
      }
    } catch (err) {
      alert('A system error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prem-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '100px 20px', background: '#ECECEC' }}>
      <motion.div 
        className="neo-card" 
        style={{ maxWidth: '650px', width: '100%', padding: '4rem' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ 
            display: 'inline-block', 
            background: '#F4C400', 
            padding: '0.4rem 1.2rem', 
            borderRadius: '50px', 
            border: '2.5px solid #1A1A1A', 
            fontWeight: 800, 
            fontSize: '0.85rem',
            boxShadow: '3px 3px 0px #1A1A1A',
            marginBottom: '1rem'
          }}>
            STEP 01: PERSONALIZATION
          </div>
          <h2 className="neo-headline" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tell Us About Yourself</h2>
          <p style={{ color: '#666', lineHeight: 1.6 }}>
            We need these metrics to accurately calculate your <strong style={{color: '#1A1A1A'}}>Metabolic Stress Score</strong> and provide personalized food safety recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#F4C400" /> What should we call you?
            </label>
            <input 
              type="text" name="username" className="input-field" placeholder="e.g. HealthExplorer"
              value={formData.username} onChange={handleChange} required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="#F4C400" /> Age (Years)
              </label>
              <input 
                type="number" name="age" className="input-field" placeholder="25"
                value={formData.age} onChange={handleChange} required 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ruler size={18} color="#F4C400" /> Height (cm)
              </label>
              <input 
                type="number" name="height" className="input-field" placeholder="175"
                value={formData.height} onChange={handleChange} required 
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={18} color="#F4C400" /> Current Weight (kg)
            </label>
            <input 
              type="number" name="weight" className="input-field" placeholder="70"
              value={formData.weight} onChange={handleChange} required 
            />
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Allergies or Health Conditions</label>
            <textarea 
              name="healthIssues" className="input-field" placeholder="e.g. Gluten intolerance, Nut allergy, Diabetes..."
              style={{ minHeight: '120px', resize: 'vertical' }}
              value={formData.healthIssues} onChange={handleChange}
            />
          </div>

          <motion.button 
            type="submit" className="btn btn-primary" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.15rem', marginTop: '1rem' }}
          >
            {loading ? 'Processing Telemetry...' : 'Complete My Profile →'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
