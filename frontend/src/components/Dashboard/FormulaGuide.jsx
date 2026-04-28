import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Battery, 
  ShieldCheck, 
  Target, 
  AlertTriangle,
  Info
} from 'lucide-react';

const COLORS = {
  HEALTHY: '#00C896',
  CAUTION: '#F4C400',
  RISK: '#FF3A3A',
  BLACK: '#1A1A1A'
};

const FormulaGuide = () => {
  const sections = [
    {
      title: "Metabolic Health Index (MHI)",
      description: "The primary health metric. It tracks the cumulative tension between your physiological inputs (Lifestyle) and chemical environmental stressors (Food).",
      formula: "MHI = 100 - ((Food_Stress * 0.4) + (Lifestyle_Factor * 0.1))",
      icon: <Activity color={COLORS.HEALTHY} />
    },
    {
      title: "Lifestyle Factor (LF)",
      description: "Aggregates your daily habits and their impact on metabolic resilience.",
      formula: "LF = ((Sleep * 1.25) + (Stress * 15) + (Exercise * 5))",
      icon: <Zap color={COLORS.CAUTION} />
    }
  ];

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '40px' }}>
        <h1 className="neo-headline highlight" style={{ fontSize: '3rem' }}>Formula Guide</h1>
        <p style={{ fontWeight: 800, color: '#666' }}>Understanding our biometric scoring system</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {sections.map((sec, i) => (
          <div key={i} className="neo-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              {sec.icon}
              <h2 className="neo-headline">{sec.title}</h2>
            </div>
            <p style={{ fontWeight: 600, color: '#444', marginBottom: '20px' }}>{sec.description}</p>
            <div style={{ background: '#F0F0F0', padding: '20px', borderRadius: '15px', border: '2px solid #1A1A1A' }}>
              <code style={{ fontWeight: 900, color: COLORS.BLACK }}>{sec.formula}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaGuide;
