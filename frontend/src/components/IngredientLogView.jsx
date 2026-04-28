import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Calendar, Tag, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IngredientLogView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/analyze/logs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setLogs(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', padding: '120px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
           <div>
              <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, cursor: 'pointer', opacity: 0.5, marginBottom: '10px' }}>
                <ChevronLeft size={16} /> BACK TO LAB
              </button>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1A1A1A' }}>Ingredient Data Lake</h1>
              <p style={{ opacity: 0.5 }}>Historical record of all raw OCR scanned labels</p>
           </div>
           <div style={{ background: '#1A1A1A', color: '#FFF', padding: '15px 30px', borderRadius: '20px', fontWeight: 900 }}>
              {logs.length} SCANS ARCHIVED
           </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid #EEE', borderTopColor: '#1A1A1A', borderRadius: '50%', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ background: '#FFF', padding: '30px', borderRadius: '24px', border: '1px solid #EEE', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#F4C400', color: '#1A1A1A', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Database size={20} />
                      </div>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{log.productName}</div>
                         <div style={{ fontSize: '0.8rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={14} /> {new Date(log.scannedAt).toLocaleString()}
                         </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ background: '#F8F9FA', padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: '#1A1A1A' }}>
                         {log.metadata?.charCount} CHARS
                      </div>
                   </div>
                </div>

                <div style={{ background: '#1A1A1A', color: '#00FF41', padding: '20px', borderRadius: '15px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6', overflowX: 'auto' }}>
                   <div style={{ opacity: 0.4, marginBottom: '10px', fontSize: '0.7rem', borderBottom: '1px solid rgba(0,255,65,0.1)', paddingBottom: '5px' }}>RAW OCR SPECTRUM DATA</div>
                   {log.rawOcrText}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default IngredientLogView;
