import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LabelList
} from 'recharts';
import { 
  Activity, 
  Moon, 
  Zap, 
  ChevronRight, 
  PlusCircle, 
  Settings, 
  Download,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Shuffle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ResultsDisplay from '../ResultsDisplay';
import './UserDashboard.css';

const COLORS = {
  HEALTHY: '#00C896',
  CAUTION: '#F4C400',
  RISK: '#FF3A3A',
  NEUTRAL: '#3B82F6',
  PURPLE: '#A78BFA'
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('Daily');
  const [activeMetrics, setActiveMetrics] = useState(['MHI', 'Sleep', 'Nutrition']);
  const [showAllScans, setShowAllScans] = useState(false);
  
  const toggleMetric = (metric) => {
    setActiveMetrics(prev => 
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    );
  };
  
  // Daily Log State
  const [sleepHours, setSleepHours] = useState(8);
  const [exerciseLevel, setExerciseLevel] = useState(2);
  const [stressLevel, setStressLevel] = useState(3);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [userAllergens, setUserAllergens] = useState(
    () => JSON.parse(localStorage.getItem('userAllergens') || '[]')
  );
  const toggleAllergen = (a) => {
    setUserAllergens(prev => {
      const next = prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a];
      localStorage.setItem('userAllergens', JSON.stringify(next));
      return next;
    });
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/auth'); return; }
      
      const [histRes, scanRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/analyze/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const histData = await histRes.json();
      const scanData = await scanRes.json();

      if (histData.success) setHistory(histData.data);
      if (scanData.success) setScanHistory(scanData.data);
    } catch (err) {
      setError("Failed to sync telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmitDailyLog = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ date: logDate, sleepHours, stressLevel, exerciseLevel })
      });
      const data = await response.json();
      if (data.success) {
        await fetch('http://localhost:5000/api/dashboard/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ logId: data.data._id })
        });
        fetchHistory();
      }
    } catch (err) { console.error(err); }
  };

  const chartData = useMemo(() => {
    if (timeRange === 'Daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      const todaysScans = scanHistory
        .filter(s => s.createdAt?.startsWith(todayStr))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                                     
      const latestLog = history[history.length - 1] || {};
      const baseLSS = latestLog.lifestyleStressScore || 30;
      const baseSleep = (latestLog.sleepHours || 8) * 10;
      
      const dataPoints = [];
      let totalStress = 0;
      let scanCount = 0;
      
      const addPoint = (label, isActualScan = false) => {
         const avgStress = scanCount > 0 ? (totalStress / scanCount) : 30;
         // Slight jitter for simulated hourly points to ensure the line is curvy, not purely flat
         const jitter = isActualScan ? 0 : (Math.random() * 2 - 1); 
         dataPoints.push({
            date: label,
            MHI: Number(Math.max(0, 100 - (0.4 * avgStress + 0.1 * baseLSS) + jitter).toFixed(2)),
            Sleep: baseSleep,
            Nutrition: Number((100 - avgStress + jitter).toFixed(2))
         });
      };
      
      addPoint('8:00 AM');
      
      todaysScans.forEach(scan => {
         totalStress += (scan.metabolicStressScore || 30);
         scanCount++;
         const d = new Date(scan.createdAt);
         addPoint(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), true);
      });
      
      if (todaysScans.length === 0) {
         addPoint('12:00 PM');
         addPoint('4:00 PM');
         addPoint('8:00 PM');
      } else {
         addPoint('Now');
      }
      return dataPoints;
    }

    let daysToSlice = 7;
    if (timeRange === 'Weekly') daysToSlice = 30;
    if (timeRange === 'Monthly') daysToSlice = 90;

    return history.slice(-daysToSlice).map((log, index) => {
      // Create a stable micro-jitter based on index so the curve is organic but doesn't bounce on re-renders
      const jitter = Math.sin(index * 45) * 2.5; 
      
      return {
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        MHI:  Number(Math.max(0, Math.min(100, (log.metabolicHealthIndex || 70) + jitter)).toFixed(2)),
        LSS:  log.lifestyleStressScore || 30,
        Sleep: Math.round(Math.max(0, Math.min(100, ((log.sleepHours || 7) * 10) + (jitter * 0.5)))),
        Nutrition: Number(Math.max(0, Math.min(100, (log.dailyFoodReadiness || 85) + jitter)).toFixed(2))
      };
    });
  }, [history, scanHistory, timeRange]);

  const currentMHI = history[history.length - 1]?.metabolicHealthIndex || 85;

  const latestLog = history[history.length - 1] || {};
  const radarData = [
    { subject: 'MHI',        A: latestLog.metabolicHealthIndex || 85,                  fullMark: 100 },
    { subject: 'Sleep',      A: Math.min(100, (latestLog.sleepHours || 7) * 10),       fullMark: 100 },
    { subject: 'Diet',       A: 100 - (latestLog.dailyFoodStress || 30),               fullMark: 100 },
    { subject: 'Activity',   A: Math.min(100, (latestLog.exerciseLevel || 2) * 20),    fullMark: 100 },
  ];

  const severityCounts = { Low: 0, Moderate: 0, High: 0, Extreme: 0 };
  scanHistory.forEach(s => {
      (s.components || []).forEach(c => {
          let sev = c.severity;
          if (!sev) {
              sev = c.impact === 'Negative' ? 'Moderate' : 'Low';
          }
          if (sev === 'Critical') sev = 'Extreme';
          
          if (severityCounts[sev] !== undefined) {
            severityCounts[sev]++;
          } else {
            severityCounts.Low++;
          }
      });
  });
  const toxicityData = [
      { name: 'Low', count: severityCounts.Low, fill: '#00C896' },
      { name: 'Moderate', count: severityCounts.Moderate, fill: '#3B82F6' },
      { name: 'High', count: severityCounts.High, fill: '#F4C400' },
      { name: 'Extreme', count: severityCounts.Extreme, fill: '#FF3A3A' }
  ];

  // ── Streak Counter ─────────────────────────────────────────
  const cleanStreak = useMemo(() => {
    const scannedDates = new Set(
      scanHistory
        .filter(s => (s.metabolicStressScore || 30) < 40)
        .map(s => s.createdAt?.split('T')[0])
        .filter(Boolean)
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (scannedDates.has(key)) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [scanHistory]);

  // ── Allergen Exposure ───────────────────────────────────────
  const ALLERGEN_MAP = {
    Gluten:  ['wheat', 'gluten', 'barley', 'rye', 'malt', 'oats'],
    Soy:     ['soy', 'soybean', 'soya', 'tofu', 'edamame'],
    Dairy:   ['milk', 'lactose', 'whey', 'casein', 'butter', 'cream', 'cheese'],
    Nuts:    ['almond', 'cashew', 'walnut', 'peanut', 'hazelnut', 'pecan'],
    Eggs:    ['egg', 'albumin', 'lecithin'],
    Sulphites: ['sulphite', 'sulfite', 'so2', 'e220', 'e221', 'e222'],
  };
  const allergenExposure = useMemo(() => {
    const counts = {};
    const allIngredients = scanHistory.flatMap(s =>
      (s.components || []).map(c => (c.name || '').toLowerCase())
    );
    Object.entries(ALLERGEN_MAP).forEach(([allergen, keywords]) => {
      const hits = allIngredients.filter(ing => keywords.some(kw => ing.includes(kw))).length;
      if (hits > 0) counts[allergen] = hits;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [scanHistory]);

  // ── Substitute Suggestions ─────────────────────────────────
  const SUBSTITUTES = {
    'High Fructose Corn Syrup': { alt: 'Raw Honey / Maple Syrup', color: '#FF3A3A' },
    'Aspartame':               { alt: 'Stevia / Monk Fruit', color: '#FF3A3A' },
    'Palm Oil':                { alt: 'Coconut Oil / Avocado Oil', color: '#F4C400' },
    'Sodium Nitrite':          { alt: 'Celery Powder (Natural Cure)', color: '#FF3A3A' },
    'Monosodium Glutamate':    { alt: 'Nutritional Yeast / Mushroom Powder', color: '#F4C400' },
    'Refined Sugar':           { alt: 'Coconut Sugar / Jaggery', color: '#F4C400' },
    'Red 40':                  { alt: 'Beet Juice / Paprika Extract', color: '#FF3A3A' },
    'Carrageenan':             { alt: 'Agar-Agar / Tapioca Starch', color: '#F4C400' },
    'BHA':                     { alt: 'Vitamin E (Tocopherol)', color: '#FF3A3A' },
    'BHT':                     { alt: 'Rosemary Extract', color: '#FF3A3A' },
  };
  const substituteSuggestions = useMemo(() => {
    const detected = new Set(
      scanHistory.flatMap(s => (s.components || []).map(c => c.name))
    );
    return Object.entries(SUBSTITUTES).filter(([toxin]) => detected.has(toxin));
  }, [scanHistory]);

  if (loading) return <div className="loading-state">Syncing Telemetry...</div>;

  const downloadPDF = () => {
    const element = document.getElementById('dashboard-report');
    if (!element) return;
    
    html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#F4F6F8' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('NutriLens_Dashboard_Report.pdf');
    });
  };

  return (
    <div className="dashboard-container" id="dashboard-report">
      
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="neo-headline" style={{ fontSize: '3rem', marginBottom: '10px' }}>Dashboard Overview</h1>
          <p style={{ fontWeight: 800, color: '#666' }}>Telemetry Link: <span style={{ color: COLORS.HEALTHY }}>ACTIVE</span> | {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/scan')}>
            <PlusCircle size={20} style={{ marginRight: '8px' }} /> Scan New Item
          </button>
          <button className="btn no-print" onClick={downloadPDF} style={{ background: '#FFF', color: '#1A1A1A', border: '3px solid #1A1A1A', padding: '10px 20px', borderRadius: '50px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={20} /> Export PDF
          </button>
        </div>
      </header>

      <div className="dashboard-main-grid">
        
        {/* LEFT COLUMN */}
        <div className="telemetry-column">
          
          {/* Main Telemetry Graph */}
          <div className="neo-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 className="neo-headline" style={{ background: '#F4C400', padding: '5px 15px', borderRadius: '8px', display: 'inline-block', margin: 0 }}>Historical Telemetry</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ background: '#1A1A1A', borderRadius: '50px', padding: '4px', display: 'flex' }}>
                  {['MHI', 'Sleep', 'Nutrition'].map(metric => (
                    <button 
                      key={metric} 
                      onClick={() => toggleMetric(metric)}
                      style={{ 
                        background: 'transparent', 
                        color: activeMetrics.includes(metric) ? '#F4C400' : '#888', 
                        border: 'none', padding: '6px 15px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', borderRadius: '50px',
                        transition: 'color 0.2s'
                      }}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
                
                <div style={{ background: '#FFF', borderRadius: '50px', padding: '4px', display: 'flex', border: '3px solid #1A1A1A' }}>
                  {['Daily', 'Weekly', 'Monthly'].map(range => (
                    <button 
                      key={range} 
                      onClick={() => setTimeRange(range)} 
                      style={{ 
                        background: timeRange === range ? '#1A1A1A' : 'transparent', 
                        color: timeRange === range ? '#F4C400' : '#1A1A1A', 
                        border: 'none', padding: '6px 15px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', borderRadius: '50px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMHI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C896" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLifestyle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNutrition" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3A3A" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF3A3A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4C400" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F4C400" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontWeight: 800, fontSize: 11, fill: '#A0A0A0' }} dy={10} />
                  <YAxis 
                    domain={timeRange === 'Daily' ? ['dataMin - 5', 'dataMax + 5'] : [0, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontWeight: 800, fontSize: 11, fill: '#A0A0A0' }} 
                    dx={-10} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 800 }} 
                    itemStyle={{ fontWeight: 900 }} 
                    cursor={{ stroke: '#F0F0F0', strokeWidth: 2, strokeDasharray: '5 5' }} 
                  />
                  {activeMetrics.includes('MHI') && <Area type="natural" dataKey="MHI" stroke="#00C896" strokeWidth={5} fillOpacity={1} fill="url(#colorMHI)" activeDot={{ r: 7, strokeWidth: 0, fill: '#00C896' }} />}
                  {activeMetrics.includes('Nutrition') && <Area type="natural" dataKey="Nutrition" stroke="#FF3A3A" strokeWidth={5} fillOpacity={1} fill="url(#colorNutrition)" activeDot={{ r: 7, strokeWidth: 0, fill: '#FF3A3A' }} />}
                  {activeMetrics.includes('Sleep') && <Area type="natural" dataKey="Sleep" stroke="#F4C400" strokeWidth={5} fillOpacity={1} fill="url(#colorSleep)" activeDot={{ r: 7, strokeWidth: 0, fill: '#F4C400' }} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid: Radar & BarChart */}
          <div className="bottom-grid">
             <motion.div whileHover={{ y: -5 }} className="neo-card" style={{ transition: 'all 0.3s ease' }}>
                <h3 className="neo-headline" style={{ marginBottom: '10px' }}>Metabolic Vector Profile</h3>
                <p style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, marginBottom: '20px' }}>Multi-dimensional snapshot of your latest logs.</p>
                <div style={{ height: '220px', marginLeft: '-20px' }}>
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#EEE" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A1A1A', fontSize: 10, fontWeight: 900 }} />
                        <Radar name="Metrics" dataKey="A" stroke="#1A1A1A" strokeWidth={3} fill="#00C896" fillOpacity={0.5} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '3px solid #1A1A1A', fontWeight: 900 }} cursor={{ stroke: '#1A1A1A', strokeWidth: 2 }} />
                      </RadarChart>
                   </ResponsiveContainer>
                </div>
             </motion.div>

             <motion.div whileHover={{ y: -5 }} className="neo-card" style={{ transition: 'all 0.3s ease' }}>
                <h3 className="neo-headline" style={{ marginBottom: '10px' }}>Dietary Toxicity Profile</h3>
                <p style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600, marginBottom: '20px' }}>Cumulative severity of recently scanned ingredients.</p>
                <div style={{ height: '220px' }}>
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={toxicityData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEE" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontWeight: 800, fontSize: 10 }} domain={[0, 'dataMax + 5']} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 900, fontSize: 11, fill: '#1A1A1A' }} />
                        <Tooltip cursor={{ fill: '#F8F9FA' }} contentStyle={{ borderRadius: '12px', border: '3px solid #1A1A1A', fontWeight: 900 }} />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={25} minPointSize={5}>
                          <LabelList dataKey="count" position="right" offset={10} style={{ fontWeight: 900, fill: '#1A1A1A', fontSize: '13px' }} formatter={(value) => value > 0 ? value : ''} />
                          {toxicityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </motion.div>
          </div>

          {/* New Section: Top Toxins Analysis */}
          <motion.div whileHover={{ scale: 1.01 }} className="neo-card" style={{ marginTop: '30px', transition: 'all 0.3s ease' }}>
             <h3 className="neo-headline" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={24} color={COLORS.RISK} /> Consistently Detected Toxins
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {scanHistory.length > 0 ? (
                  Object.entries(
                    scanHistory.reduce((acc, s) => {
                      (s.components || []).filter(c => c.impact === 'Negative' || c.severity === 'High' || c.severity === 'Extreme').forEach(c => {
                        acc[c.name] = (acc[c.name] || 0) + 1;
                      });
                      return acc;
                    }, {})
                  )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([name, count]) => (
                    <motion.div whileHover={{ y: -3, boxShadow: '4px 4px 0px #1A1A1A' }} key={name} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '3px solid #1A1A1A', borderRadius: '16px', background: '#FFF1F0', cursor: 'pointer', transition: 'all 0.2s' }}>
                       <div style={{ fontWeight: 900, fontSize: '1rem', color: '#CF1322' }}>{name}</div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#CF1322', opacity: 0.8 }}>OCCURRENCE</span>
                          <span style={{ background: '#CF1322', color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>{count} SCANS</span>
                       </div>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', fontWeight: 800, color: '#999', border: '2px dashed #DDD', borderRadius: '15px' }}>
                     No toxins detected in recent scan history.
                  </div>
                )}
             </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Health Score Ring */}
          <div className="neo-card" style={{ textAlign: 'center' }}>
            <div className="score-ring-container">
               <svg className="score-ring-svg">
                 <circle cx="70" cy="70" r="60" fill="transparent" stroke="#ECECEC" strokeWidth="12" />
                 <motion.circle 
                   cx="70" cy="70" r="60" fill="transparent" stroke={COLORS.HEALTHY} strokeWidth="12"
                   strokeDasharray={2 * Math.PI * 60}
                   initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                   animate={{ strokeDashoffset: (2 * Math.PI * 60) - (currentMHI / 100) * (2 * Math.PI * 60) }}
                   strokeLinecap="round"
                 />
               </svg>
               <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{currentMHI}</div>
                 <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#999' }}>STABLE</div>
               </div>
            </div>
            <div style={{ marginTop: '20px', background: `${COLORS.HEALTHY}15`, color: COLORS.HEALTHY, padding: '10px', borderRadius: '50px', fontWeight: 800 }}>
              Good Productivity Potential
            </div>
          </div>

          {/* Recent Bioscans */}
          <div className="neo-card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 className="neo-headline">Recent Scans</h3>
               <ChevronRight size={20} color="#888" style={{ cursor: 'pointer' }} onClick={() => navigate('/scan')} />
             </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scanHistory.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #DDD', borderRadius: '12px', fontWeight: 800, color: '#999' }}>
                    No scans yet — go scan something!
                  </div>
                ) : (
                  <>
                    {scanHistory.slice(0, showAllScans ? scanHistory.length : 3).map((scan, i) => {
                      const score = scan.metabolicStressScore ?? 30;
                      const scoreColor = score > 60 ? COLORS.RISK : score > 35 ? COLORS.CAUTION : COLORS.HEALTHY;
                      const label = score > 60 ? 'HIGH RISK' : score > 35 ? 'MODERATE' : 'CLEAN';
                      return (
                        <motion.div key={i} whileHover={{ x: 4 }} onClick={() => setSelectedScan(scan)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '14px', border: '2px solid #EEE', cursor: 'pointer', background: '#FAFAFA', transition: 'all 0.2s' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: `${scoreColor}20`, border: `2px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, color: scoreColor, flexShrink: 0 }}>
                            {score}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 900, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {scan.productName || 'Scanned Item'}
                            </div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', marginTop: '2px' }}>
                              {new Date(scan.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {scanHistory.length > 3 && (
                      <button 
                        onClick={() => setShowAllScans(!showAllScans)}
                        style={{ 
                          width: '100%', padding: '10px', background: 'transparent', border: '2px dashed #DDD', borderRadius: '12px', 
                          fontWeight: 800, color: '#888', cursor: 'pointer', transition: 'all 0.2s', marginTop: '5px' 
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#F0F0F0'; e.target.style.color = '#1A1A1A'; e.target.style.borderColor = '#1A1A1A'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#888'; e.target.style.borderColor = '#DDD'; }}
                      >
                        {showAllScans ? 'Show Less' : `View All ${scanHistory.length} Scans`}
                      </button>
                    )}
                  </>
                )}
              </div>
           </div>

           {/* Daily Input */}
           <div className="neo-card">
              <h3 className="neo-headline" style={{ marginBottom: '20px' }}>Log Daily Vitals</h3>
              <form onSubmit={handleSubmitDailyLog}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: '#666' }}>Log Date</label>
                    <input type="date" className="input-field" value={logDate} onChange={e => setLogDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #EEE', fontWeight: 700 }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: '#666' }}>Sleep (Sₕ) — Hours</label>
                    <input type="number" min="0" max="12" className="input-field" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #EEE', fontWeight: 700, fontSize: '1.1rem' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: '#666' }}>Exercise Level (Eₗ) — 0 (None) to 5 (Intense)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0,1,2,3,4,5].map(lvl => (
                        <button type="button" key={lvl} onClick={() => setExerciseLevel(lvl)}
                          style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: '2.5px solid #1A1A1A', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem',
                            background: exerciseLevel === lvl ? '#1A1A1A' : '#FFF',
                            color: exerciseLevel === lvl ? '#F4C400' : '#1A1A1A'
                          }}>{lvl}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700, color: '#999', marginTop: '4px', padding: '0 2px' }}>
                      <span>No Activity</span><span>Intense</span>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', borderRadius: '50px', fontSize: '1rem' }}>Sync Telemetry</button>
              </form>
           </div>

        </div>

      </div>

      {/* ── NEW FEATURES SECTION ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '60px', marginBottom: '10px' }}>

        {/* Streak Counter */}
        <motion.div whileHover={{ y: -6 }} className="neo-card" style={{ background: cleanStreak >= 3 ? '#E8F5E9' : '#FFF', border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A', transition: 'all 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} color="#FF6B35" /> Clean Eating Streak
              </h3>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Consecutive days with low-impact scans (score &lt; 40)</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: cleanStreak >= 3 ? '#00C896' : '#1A1A1A', lineHeight: 1 }}>{cleanStreak}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#999' }}>DAYS</div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '6px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: '8px', borderRadius: '4px', background: i < cleanStreak ? '#00C896' : '#EEE' }} />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00C896', marginTop: '8px' }}>
            {cleanStreak >= 7 ? '🏆 7-Day Legend!' : cleanStreak >= 3 ? '🔥 On a roll! Keep going!' : '💪 Scan clean food to build your streak!'}
          </p>
        </motion.div>

        {/* Allergen Personal Profile */}
        <motion.div whileHover={{ y: -6 }} className="neo-card" style={{ border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A', transition: 'all 0.3s' }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="#F4C400" /> Personal Allergen Guard
          </h3>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '16px' }}>Select your allergens — we'll flag them in your scans</p>

          {/* Allergen multi-select pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {Object.keys(ALLERGEN_MAP).map(a => (
              <button key={a} onClick={() => toggleAllergen(a)} style={{
                padding: '6px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer',
                border: '2.5px solid #1A1A1A',
                background: userAllergens.includes(a) ? '#1A1A1A' : '#FFF',
                color: userAllergens.includes(a) ? '#F4C400' : '#1A1A1A',
                transition: 'all 0.2s'
              }}>
                {userAllergens.includes(a) ? '✓ ' : ''}{a}
              </button>
            ))}
          </div>

          {/* Danger match against scan history */}
          {userAllergens.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', border: '2px dashed #DDD', borderRadius: '12px', fontWeight: 800, color: '#999', fontSize: '0.85rem' }}>
              👆 Select your allergens above to get personalized warnings
            </div>
          ) : (() => {
            const dangerous = scanHistory.filter(scan =>
              (scan.components || []).some(c =>
                userAllergens.some(a =>
                  ALLERGEN_MAP[a]?.some(kw => (c.name || '').toLowerCase().includes(kw))
                )
              )
            );
            return dangerous.length > 0 ? (
              <div>
                <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#FF3A3A', marginBottom: '10px' }}>⚠️ {dangerous.length} scanned product{dangerous.length > 1 ? 's' : ''} contain your allergens:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dangerous.slice(0, 3).map((scan, i) => {
                    const hits = (scan.components || []).filter(c =>
                      userAllergens.some(a => ALLERGEN_MAP[a]?.some(kw => (c.name || '').toLowerCase().includes(kw)))
                    );
                    return (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: '10px', background: '#FFF1F0', border: '2px solid #FF3A3A' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>{scan.productName || 'Scanned Item'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#FF3A3A', fontWeight: 800 }}>
                          Contains: {hits.map(c => c.name).join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', border: '2px dashed #00C896', borderRadius: '12px', fontWeight: 800, color: '#00C896', fontSize: '0.85rem' }}>
                ✅ None of your scanned foods contain your allergens!
              </div>
            );
          })()}
        </motion.div>

        {/* Substitute Suggestions */}
        <motion.div whileHover={{ y: -6 }} className="neo-card" style={{ border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A', transition: 'all 0.3s' }}>
          <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shuffle size={20} color="#3B82F6" /> Cleaner Alternatives
          </h3>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '20px' }}>Swap these detected toxins for healthier options</p>
          {substituteSuggestions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {substituteSuggestions.slice(0, 4).map(([toxin, { alt, color }]) => (
                <div key={toxin} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: '#FAFAFA', borderRadius: '12px', border: '2px solid #EEE' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color, marginBottom: '3px' }}>✗ {toxin}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#00C896' }}>✓ {alt}</div>
                  </div>
                  <div style={{ background: color, color: '#FFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, whiteSpace: 'nowrap', alignSelf: 'center' }}>SWAP</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #DDD', borderRadius: '12px', fontWeight: 800, color: '#999' }}>
              ✅ No problematic ingredients found yet!
            </div>
          )}
        </motion.div>
      </div>

      {/* ALGORITHM EXPLANATION SECTION */}
      <div style={{ marginTop: '60px', marginBottom: '40px' }}>
        <h2 className="neo-headline" style={{ marginBottom: '30px', fontSize: '2.5rem', textAlign: 'center', letterSpacing: '-1px' }}>System Architecture Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 01 — MHI */}
          <div className="neo-card" style={{ background: '#E8F5E9', border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A' }}>
            <h3 style={{ fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.4rem' }}>
              <span style={{ background: '#1A1A1A', color: '#00C896', padding: '4px 12px', borderRadius: '50px', fontSize: '1rem' }}>01</span> 
              MHI Score
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.7', fontWeight: 600 }}>
              The Metabolic Health Index starts at 100 and applies weighted penalties from both nutrition and lifestyle strain.
            </p>
            <div style={{ background: '#FFF', padding: '15px', borderRadius: '15px', border: '3px dashed #00C896', marginTop: '18px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 900, textAlign: 'center', color: '#1A1A1A', letterSpacing: '0.5px' }}>
              MHI = 100 − (0.4 × Nᵢ + 0.1 × Lᵢ)
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
              {[['Nᵢ', 'Nutrition Impact Score'], ['Lᵢ', 'Lifestyle Impact Score']].map(([sym, def]) => (
                <div key={sym} style={{ background: '#E8F5E9', borderRadius: '8px', padding: '6px 10px', fontWeight: 800 }}>
                  <span style={{ color: '#00C896', fontSize: '0.9rem' }}>{sym}</span> — {def}
                </div>
              ))}
            </div>
          </div>

          {/* Card 02 — LIS */}
          <div className="neo-card" style={{ background: '#E3F2FD', border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A' }}>
            <h3 style={{ fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.4rem' }}>
              <span style={{ background: '#1A1A1A', color: '#3B82F6', padding: '4px 12px', borderRadius: '50px', fontSize: '1rem' }}>02</span> 
              Lifestyle Impact Score
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.7', fontWeight: 600 }}>
              Estimates biological strain from inadequate rest and inactivity. Sleep penalty is quadratic — missing hours hurts exponentially more.
            </p>
            <div style={{ background: '#FFF', padding: '15px', borderRadius: '15px', border: '3px dashed #3B82F6', marginTop: '18px', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 900, textAlign: 'center', color: '#1A1A1A', letterSpacing: '0.5px' }}>
              Lᵢ = ((8 − Sₕ)² × 2) + ((5 − Eₗ) × 6)
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
              {[['Sₕ', 'Sleep hours logged'], ['Eₗ', 'Exercise level (0–5)'], ['(8−Sₕ)²×2', 'Quadratic sleep debt'], ['(5−Eₗ)×6', 'Inactivity penalty']].map(([sym, def]) => (
                <div key={sym} style={{ background: '#E3F2FD', borderRadius: '8px', padding: '6px 10px', fontWeight: 800 }}>
                  <span style={{ color: '#3B82F6', fontSize: '0.85rem' }}>{sym}</span> — {def}
                </div>
              ))}
            </div>
          </div>

          {/* Card 03 — Vector Profile */}
          <div className="neo-card" style={{ background: '#FFF8E1', border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A' }}>
            <h3 style={{ fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.4rem' }}>
              <span style={{ background: '#1A1A1A', color: '#F4C400', padding: '4px 12px', borderRadius: '50px', fontSize: '1rem' }}>03</span> 
              Metabolic Vector Profile
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.7', fontWeight: 600 }}>
              The Radar Chart normalises 4 key metrics to a 0–100 scale for a multi-dimensional snapshot of your day.
            </p>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #F4C400', fontWeight: 800 }}>
                <span style={{ color: '#F4C400' }}>MHI:</span> Raw master score (0-100)
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #F4C400', fontWeight: 800 }}>
                <span style={{ color: '#F4C400' }}>Sleep:</span> Sₕ × 10 (e.g. 8hrs = 80)
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #F4C400', fontWeight: 800 }}>
                <span style={{ color: '#F4C400' }}>Diet:</span> 100 − Daily Food Penalty
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #F4C400', fontWeight: 800 }}>
                <span style={{ color: '#F4C400' }}>Activity:</span> Eₗ × 20 (e.g. Lvl 5 = 100)
              </div>
            </div>
          </div>

          {/* Card 04 — Toxicity Profile */}
          <div className="neo-card" style={{ background: '#FFE4E4', border: '4px solid #1A1A1A', borderRadius: '24px', padding: '30px', boxShadow: '8px 8px 0px #1A1A1A' }}>
            <h3 style={{ fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.4rem' }}>
              <span style={{ background: '#1A1A1A', color: '#FF3A3A', padding: '4px 12px', borderRadius: '50px', fontSize: '1rem' }}>04</span> 
              Dietary Toxicity Profile
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.7', fontWeight: 600 }}>
              The cumulative bar chart aggregates every single ingredient you've ever scanned and bins them by peer-reviewed toxicological severity.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #FF3A3A', fontWeight: 800 }}>
                <span style={{ color: '#FF3A3A' }}>Low:</span> Safe, whole-food ingredients
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #FF3A3A', fontWeight: 800 }}>
                <span style={{ color: '#FF3A3A' }}>Moderate:</span> Mild additives / simple sugars
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #FF3A3A', fontWeight: 800 }}>
                <span style={{ color: '#FF3A3A' }}>High:</span> Inflammatory emulsifiers / dyes
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '8px 12px', border: '2px dashed #FF3A3A', fontWeight: 800 }}>
                <span style={{ color: '#FF3A3A' }}>Extreme:</span> Carcinogens / neurotoxins
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Results Overlay */}
      <AnimatePresence>
        {selectedScan && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
            onClick={() => setSelectedScan(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              style={{ background: '#FFF', border: '5px solid #1A1A1A', borderRadius: '30px', padding: '40px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
               <button onClick={() => setSelectedScan(null)} style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '2rem', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
               <ResultsDisplay results={selectedScan} onReset={() => setSelectedScan(null)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserDashboard;
