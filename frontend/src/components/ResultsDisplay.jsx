import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { ShieldAlert, Leaf, RefreshCcw } from 'lucide-react';

const CATEGORY_COLORS = {
  'Good': '#00C853', // Green
  'Bad': '#FF3D00'   // Red
};

const ResultsDisplay = ({ results, onReset }) => {
  const components = results?.components || [];
  
  const pieData = useMemo(() => {
    let goodCount = 0;
    let badCount = 0;
    
    components.forEach(c => {
      const cat = c.category;
      if (['Natural Ingredients', 'Protein Sources'].includes(cat)) {
        goodCount++;
      } else if (['Additives', 'Preservatives', 'Emulsifiers', 'Sweeteners', 'Industrial Fats', 'Oils'].includes(cat)) {
        badCount++;
      } else {
        badCount++; // Default to bad if unknown/suspect
      }
    });

    // Don't render empty slices
    const data = [];
    if (goodCount > 0) data.push({ name: 'Good', value: goodCount });
    if (badCount > 0) data.push({ name: 'Bad', value: badCount });
    
    return data.length ? data : [{ name: 'Unknown', value: 1 }];
  }, [components]);

  if (!results) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#1A1A1A', marginBottom: '10px' }}>
          {results.name || 'Analysis Complete'}
        </h1>
        <div style={{ display: 'inline-block', padding: '10px 20px', background: results.metabolicStressScore > 50 ? '#FFF0F0' : '#F0FFF0', color: results.metabolicStressScore > 50 ? '#FF3D00' : '#00C853', borderRadius: '50px', fontWeight: 800, fontSize: '1.2rem' }}>
          Stress Score: {results.metabolicStressScore}/100
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        
        {/* PIE CHART */}
        <div style={{ background: '#FFF', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #EEE' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 900, marginBottom: '20px' }}>Food Composition</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#9E9E9E'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 800 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 800 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY & AUDIT */}
        <div>
          <div style={{ background: '#1A1A1A', color: '#FFF', padding: '25px', borderRadius: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="#F4C400" /> Executive Summary
            </h3>
            <p style={{ opacity: 0.8, lineHeight: '1.6' }}>{results.summary || results.geminiSummary || 'Metabolic analysis details pending.'}</p>
          </div>

          <h3 style={{ fontWeight: 900, marginBottom: '15px', color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Leaf size={20} /> Detected Ingredients
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
            {components.length === 0 && <div style={{ opacity: 0.5 }}>No distinct ingredients identified.</div>}
            {components.map((c, i) => {
              const isGood = ['Natural Ingredients', 'Protein Sources'].includes(c.category);
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#FFF', borderRadius: '12px', borderLeft: `5px solid ${isGood ? '#00C853' : '#FF3D00'}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>{c.category}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isGood ? '#00C853' : '#FF3D00' }}>
                    {c.impact || (isGood ? 'Safe' : 'Caution')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <button 
          onClick={onReset}
          style={{ background: '#F4C400', color: '#1A1A1A', border: 'none', padding: '15px 40px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(244, 196, 0, 0.3)' }}
        >
          <RefreshCcw size={20} /> NEW SCAN
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;

