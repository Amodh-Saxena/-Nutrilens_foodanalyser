import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';
import ResultsDisplay from './ResultsDisplay';

import Tesseract from 'tesseract.js';

const STAGES = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  REVEAL: 'REVEAL'
};

const StoryFlow = () => {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [analysisData, setAnalysisData] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const initiateAnalysis = async (file) => {
    setStage(STAGES.PREPARING);
    setError(null);
    setStatus('Initializing Bio-Scanner...');
    
    let worker;
    try {
      let text = "";
      
      if (file === 'DIAGNOSTIC_MOCK_FILE') {
        // SYSTEM TEST: Bypass OCR and inject test string
        setStatus('Injecting Diagnostic Molecular String...');
        await new Promise(r => setTimeout(r, 1500));
        text = "Sugar, Palm Oil, INS 322, Salt, Wheat Flour, Sodium Benzoate";
      } else {
        // 1. ROBUST OCR SCAN (Bypassing worker serialization error)
        setStatus('Configuring Neural Engine...');
        const result = await Tesseract.recognize(
          file,
          'eng',
          { 
            logger: m => {
              if (m.status === 'recognizing text') {
                setStatus(`Extracting Molecular Data: ${Math.round(m.progress * 100)}%`);
              }
            }
          }
        );
        text = result.data.text;
      }

      if (!text || text.trim().length < 3) {
        throw new Error('Label unreadable. Please ensure lighting is optimal.');
      }

      setStatus('Synchronizing with Global DB...');

      // 2. TRANSMIT TO BACKEND (ARCHIVAL & ANALYSIS)
      const formData = new FormData();
      formData.append('image', file);
      formData.append('extractedText', text);
      formData.append('productName', 'User Scan');

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAnalysisData(data.data);
        setStage(STAGES.REVEAL);
      } else {
        throw new Error(data.error || 'System Rejection');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setStage(STAGES.IDLE);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF', color: '#1A1A1A', padding: '120px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <AnimatePresence mode="wait">
          {stage === STAGES.IDLE && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-block', background: '#F4C400', padding: '8px 20px', borderRadius: '50px', fontWeight: 900, fontSize: '0.7rem', marginBottom: '20px', letterSpacing: '1px' }}>
                  LABORATORY ACCESS GRANTED
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '15px' }}>Start Ingredient Autopsy</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.5, maxWidth: '600px', margin: '0 auto' }}>
                  Select your data ingestion method to begin a comprehensive metabolic breakdown of your food.
                </p>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ background: '#FFF0F0', border: '1px solid #FF3D00', color: '#FF3D00', padding: '20px', borderRadius: '20px', marginTop: '30px', fontWeight: 800, fontSize: '0.9rem' }}
                  >
                    ⚠️ SCAN PROTOCOL ERROR: {error}
                    <div onClick={() => setError(null)} style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '5px', fontSize: '0.7rem' }}>DISMISS</div>
                  </motion.div>
                )}
              </div>

              <ImageUpload onImageUpload={initiateAnalysis} />
            </motion.div>
          )}

          {stage === STAGES.PREPARING && (
            <motion.div 
              key="preparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', paddingTop: '10vh' }}
            >
              <div style={{ marginBottom: '40px' }}>
                <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   style={{ width: '80px', height: '80px', border: '8px solid #F0F0F0', borderTopColor: '#1A1A1A', borderRadius: '50%', margin: '0 auto' }}
                />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>{status}</h2>
              <p style={{ opacity: 0.5, marginTop: '10px' }}>Scientific Protocol in Progress...</p>
            </motion.div>
          )}

          {stage === STAGES.REVEAL && (
            <ResultsDisplay results={analysisData} onReset={() => setStage(STAGES.IDLE)} />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default StoryFlow;
