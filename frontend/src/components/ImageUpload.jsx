import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, ShieldCheck, Zap } from 'lucide-react';

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* OPTION 1: INSTANT CAMERA SCAN */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Camera module initialization pending...')}
          style={{ 
            background: '#FDFDFD', 
            border: '2px solid #1A1A1A', 
            borderRadius: '24px', 
            padding: '40px 20px', 
            textAlign: 'center', 
            cursor: 'pointer',
            boxShadow: '0 10px 0 #1A1A1A'
          }}
        >
          <div style={{ background: '#1A1A1A', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Camera color="#FFF" size={28} />
          </div>
          <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '10px' }}>BIO-SCAN</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.4' }}>Use your device camera for real-time ingredient autopsy.</p>
        </motion.div>

        {/* OPTION 2: FILE UPLOAD */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={triggerFileUpload}
          style={{ 
            background: '#FDFDFD', 
            border: '2px solid #1A1A1A', 
            borderRadius: '24px', 
            padding: '40px 20px', 
            textAlign: 'center', 
            cursor: 'pointer',
            boxShadow: '0 10px 0 #1A1A1A'
          }}
        >
          <div style={{ background: '#1A1A1A', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Upload color="#FFF" size={28} />
          </div>
          <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '10px' }}>UPLOAD DATA</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.4' }}>Import a label image from your local computer drive.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
        </motion.div>
      </div>

      {/* DIAGNOSTIC TRIGGER */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
         <button 
           onClick={() => onImageUpload('DIAGNOSTIC_MOCK_FILE')}
           style={{ background: 'none', border: '1px solid #1A1A1A', padding: '10px 20px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', opacity: 0.3 }}
         >
           RUN NEURAL DIAGNOSTIC PROTOCOL
         </button>
      </div>

      {/* TRUST INDICATOR */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.5 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            <ShieldCheck size={16} /> ENCRYPTED DATA
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Zap size={16} /> INSTANT ANALYSIS
         </div>
      </div>
    </div>
  );
};

export default ImageUpload;
