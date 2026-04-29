import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'overview',    icon: '🔬', label: 'Overview' },
  { id: 'scanner',     icon: '📷', label: 'Scanner' },
  { id: 'dashboard',   icon: '📊', label: 'Dashboard' },
  { id: 'mhi',         icon: '🧠', label: 'MHI Score' },
  { id: 'lss',         icon: '🏃', label: 'LSS Formula' },
  { id: 'allergen',    icon: '🛡️', label: 'Allergen Guard' },
  { id: 'streak',      icon: '🔥', label: 'Streak Counter' },
  { id: 'substitute',  icon: '🔀', label: 'Substitutes' },
];

const Card = ({ accent = '#00C896', children, style = {} }) => (
  <div style={{
    background: '#FFF', border: `3px solid #1A1A1A`, borderRadius: '20px',
    padding: '28px', boxShadow: `6px 6px 0px ${accent}`,
    marginBottom: '24px', ...style
  }}>
    {children}
  </div>
);

const Formula = ({ children }) => (
  <div style={{
    background: '#F8F9FA', border: '2px dashed #1A1A1A', borderRadius: '14px',
    padding: '16px 20px', fontFamily: 'monospace', fontWeight: 900,
    fontSize: '1.05rem', textAlign: 'center', margin: '16px 0', letterSpacing: '0.5px'
  }}>
    {children}
  </div>
);

const VarTable = ({ rows, color }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6px', marginTop: '14px' }}>
    {rows.map(([sym, def]) => (
      <React.Fragment key={sym}>
        <div style={{ background: `${color}20`, borderRadius: '8px', padding: '6px 12px', fontFamily: 'monospace', fontWeight: 900, color, fontSize: '0.9rem' }}>{sym}</div>
        <div style={{ padding: '6px 12px', fontWeight: 700, fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center' }}>{def}</div>
      </React.Fragment>
    ))}
  </div>
);

const Step = ({ n, title, desc, accent = '#1A1A1A' }) => (
  <div style={{ display: 'flex', gap: '18px', marginBottom: '20px', alignItems: 'flex-start' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: accent, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>{n}</div>
    <div>
      <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#555', lineHeight: 1.6 }}>{desc}</div>
    </div>
  </div>
);

const UserGuide = () => {
  const [active, setActive] = useState('overview');

  const sections = {
    overview: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>What is NutriLens?</h2>
        <p style={{ fontWeight: 600, color: '#555', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '30px' }}>
          NutriLens is an AI-powered metabolic food intelligence platform. You point your camera at any packaged food label, and it performs a full biochemical audit — identifying toxic additives, scoring NOVA processing levels, calculating your daily Metabolic Health Index, and tracking your dietary patterns over time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[
            { icon: '📷', title: 'Scan Any Label', desc: 'Upload a food label image. OCR extracts the ingredient text automatically.' },
            { icon: '🧪', title: 'Deep Ingredient Audit', desc: 'Every ingredient is classified against a local biochemical database.' },
            { icon: '📊', title: 'Metabolic Dashboard', desc: 'Track MHI, Sleep, and Dietary Stress across 14-day telemetry graphs.' },
            { icon: '🛡️', title: 'Allergen Guard', desc: 'Flag your personal allergens and get instant danger alerts.' },
          ].map(f => (
            <Card key={f.title} accent="#00C896" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: 900, marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
        <Card accent="#F4C400">
          <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '8px' }}>🏗️ System Architecture</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontWeight: 800, fontSize: '0.9rem' }}>
            {['📷 Camera / Upload', '→', '🔤 Tesseract OCR', '→', '🧬 Ingredient Parser', '→', '📊 Score Engine', '→', '☁️ Firestore', '→', '📈 Dashboard'].map((s, i) => (
              <span key={i} style={{ color: s === '→' ? '#999' : '#1A1A1A', background: s === '→' ? 'none' : '#F8F9FA', padding: s === '→' ? '0' : '4px 12px', borderRadius: '8px', border: s === '→' ? 'none' : '2px solid #EEE' }}>{s}</span>
            ))}
          </div>
        </Card>
      </motion.div>
    ),

    scanner: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>How the Scanner Works</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '28px', lineHeight: 1.7 }}>The scanner is entirely frontend-powered — no third-party API calls for analysis. It runs a 4-stage pipeline locally in your browser.</p>
        <Step n="1" title="Image Capture" accent="#00C896" desc="You upload a photo of the food packaging (front + ingredients side). The image is passed to Tesseract.js, a WebAssembly OCR engine running entirely in the browser." />
        <Step n="2" title="OCR Extraction" accent="#3B82F6" desc="Tesseract scans the image and extracts raw text. A stop-word filter then removes common packaging noise words (e.g., 'contains', 'per 100g', units, percentages) leaving only the ingredient list." />
        <Step n="3" title="Ingredient Classification" accent="#F4C400" desc="Each remaining token is matched against the LOCAL_DB — a curated ingredient database with 80+ chemicals, categorized by type (Preservatives, Emulsifiers, Artificial Colors, etc.) and assigned a severity level." />
        <Step n="4" title="Score Calculation" accent="#FF3A3A" desc="The scanner starts at 100 and subtracts penalties: −25 for Extreme threats (HFCS, Aspartame), −15 for High threats (Red 40, Palm Oil), −5 per industrial additive. The result is your Metabolic Stress Score." />
        <Card accent="#FF3A3A">
          <div style={{ fontWeight: 900, marginBottom: '10px' }}>⚠️ NOVA Classification Logic</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['🔴 NOVA 4 — Ultra-Processed', 'Triggered when any ingredient belongs to: Preservatives, Emulsifiers, Artificial Colors, Industrial Fats, or Flavor Enhancers.'],
              ['🟢 NOVA 1–3 — Minimally Processed', 'No industrial chemicals detected. Only whole foods or simple culinary ingredients (salt, spices, oils).'],
            ].map(([label, desc]) => (
              <div key={label} style={{ background: '#F8F9FA', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#555' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    ),

    dashboard: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Using the Dashboard</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '28px', lineHeight: 1.7 }}>The dashboard is your personal metabolic telemetry hub. It aggregates your scan history and daily vitals into interactive graphs and insight widgets.</p>
        {[
          { title: '📈 Historical Telemetry Graph', accent: '#00C896', desc: 'Multi-line area chart showing MHI, Sleep (×10 scaled), and Nutrition trends over time. Toggle individual metrics on/off using the pill buttons. Switch between Daily (7 days), Weekly (30 days), and Monthly (90 days) views.' },
          { title: '🕸️ Metabolic Vector Radar', accent: '#3B82F6', desc: 'A 4-axis radar chart plotting MHI, Sleep Quality, Diet Quality, and Activity Level from your most recent log entry. A well-balanced polygon = strong metabolic health.' },
          { title: '📊 Dietary Toxicity Bar Chart', accent: '#FF3A3A', desc: 'Cumulative count of all scanned ingredients bucketed by severity (Low → Extreme). Helps you understand the overall toxicity profile of your food choices.' },
          { title: '🔴 Top Stressors Panel', accent: '#FF3A3A', desc: 'Ranks the most frequently detected harmful ingredients across all your scans. High occurrence of any toxin signals a systematic dietary risk.' },
          { title: '📋 Log Daily Vitals Form', accent: '#F4C400', desc: 'Log your sleep hours (Sₕ) and exercise level (Eₗ 0–5) for a specific date. Submitting triggers the backend prediction engine to calculate your LSS and MHI for that day.' },
          { title: '🕐 Recent Scans', accent: '#A78BFA', desc: 'Shows the 5 most recent scan records with product name, date, and a color-coded risk badge (CLEAN / MODERATE / HIGH RISK). Click any row to view the full scan report.' },
        ].map(s => (
          <Card key={s.title} accent={s.accent} style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', marginBottom: '8px' }}>{s.title}</div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>{s.desc}</div>
          </Card>
        ))}
      </motion.div>
    ),

    mhi: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Metabolic Health Index (MHI)</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '24px', lineHeight: 1.7 }}>The MHI is your master daily health score — a composite index that penalizes both poor diet quality and lifestyle imbalances.</p>
        <Card accent="#00C896">
          <div style={{ fontWeight: 900, marginBottom: '6px' }}>Core Formula</div>
          <Formula>MHI = 100 − (0.4 × Nₛ + 0.1 × Lₛ)</Formula>
          <VarTable color="#00C896" rows={[
            ['Nₛ', 'Nutrition Stress Score — average metabolicStressScore of all foods scanned today'],
            ['Lₛ', 'Lifestyle Stress Score — computed from sleep hours and exercise level'],
            ['0.4', 'Dietary weight — diet has 4× more impact on MHI than lifestyle'],
            ['0.1', 'Lifestyle weight — provides a secondary nudge toward healthier habits'],
          ]} />
        </Card>
        <Card accent="#3B82F6">
          <div style={{ fontWeight: 900, marginBottom: '6px' }}>Score Interpretation</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
            {[['90–100', '🟢 Excellent', '#00C896'], ['75–89', '🟡 Good', '#A8CC44'], ['60–74', '🟠 Moderate', '#F4C400'], ['40–59', '🔴 Poor', '#FF8C42'], ['0–39', '🚨 Critical', '#FF3A3A']].map(([range, label, color]) => (
              <div key={range} style={{ background: `${color}15`, border: `2px solid ${color}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, color, fontSize: '0.85rem' }}>{label}</div>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{range}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card accent="#F4C400">
          <div style={{ fontWeight: 900, marginBottom: '6px' }}>💡 How it improves</div>
          <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#555', lineHeight: 1.7 }}>Scan cleaner foods (lower Nₛ) to improve MHI rapidly. Sleep 7–9 hours and exercise daily to reduce Lₛ. Consistent improvement shows as an upward trend on the telemetry graph.</p>
        </Card>
      </motion.div>
    ),

    lss: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Lifestyle Stress Score (LSS)</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '24px', lineHeight: 1.7 }}>The LSS models biological strain caused by inadequate recovery (sleep) and physical inactivity. Sleep penalty is quadratic — a small reduction in sleep causes a disproportionately large penalty.</p>
        <Card accent="#3B82F6">
          <div style={{ fontWeight: 900, marginBottom: '6px' }}>Scientific Formula</div>
          <Formula>Lₛ = ((8 − Sₕ)² × 2) + ((5 − Eₗ) × 6)</Formula>
          <VarTable color="#3B82F6" rows={[
            ['Sₕ', 'Sleep hours logged (0–12)'],
            ['Eₗ', 'Exercise level (0 = none, 5 = intense workout)'],
            ['(8−Sₕ)² × 2', 'Quadratic sleep debt — sleep deprivation is exponentially harmful'],
            ['(5−Eₗ) × 6', 'Linear inactivity cost — each level below active adds 6 penalty points'],
          ]} />
        </Card>
        <Card accent="#FF3A3A">
          <div style={{ fontWeight: 900, marginBottom: '14px' }}>📉 Sleep Penalty Table</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {[[8,'0',true],[7,'2',false],[6,'8',false],[5,'18',false],[4,'32',false],[3,'50',false]].map(([h, pts, good]) => (
              <div key={h} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: '10px', background: good ? '#E8F5E9' : pts > 18 ? '#FFF1F0' : '#FFF8E1', border: `2px solid ${good ? '#00C896' : pts > 18 ? '#FF3A3A' : '#F4C400'}` }}>
                <div style={{ fontWeight: 900, fontSize: '1rem' }}>{h}h</div>
                <div style={{ fontWeight: 900, fontSize: '0.75rem', color: good ? '#00C896' : '#FF3A3A', marginTop: '2px' }}>+{pts}pts</div>
              </div>
            ))}
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>* Sleep penalty points for (8−Sₕ)²×2 component only.</p>
        </Card>
      </motion.div>
    ),

    allergen: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Personal Allergen Guard</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '28px', lineHeight: 1.7 }}>The Allergen Guard is a personalised safety system. Once you select your allergens, every scanned product is cross-checked and dangerous matches are flagged immediately.</p>
        <Step n="1" title="Select Your Allergens" accent="#F4C400" desc="On the dashboard, click the allergen pills (Gluten, Soy, Dairy, Nuts, Eggs, Sulphites) to mark which ones apply to you. Your selection is saved in localStorage and persists across sessions." />
        <Step n="2" title="Automatic Detection" accent="#FF3A3A" desc="Each allergen maps to a list of ingredient keywords. For example: Dairy → [milk, lactose, whey, casein, butter, cream, cheese]. Every scan's components are checked against these keyword lists." />
        <Step n="3" title="Danger Alert" accent="#FF3A3A" desc="If any scanned product contains ingredients matching your allergens, a red danger card appears showing the product name and the exact ingredient that triggered the alert." />
        <Step n="4" title="All Clear Badge" accent="#00C896" desc="If none of your scanned foods contain your allergens, a green confirmation badge is shown — giving you peace of mind." />
        <Card accent="#F4C400">
          <div style={{ fontWeight: 900, marginBottom: '12px' }}>🗂️ Allergen Keyword Map</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', fontSize: '0.82rem' }}>
            {[['Gluten','wheat, gluten, barley, rye, malt, oats'],['Soy','soy, soybean, soya, tofu, edamame'],['Dairy','milk, lactose, whey, casein, butter, cream, cheese'],['Nuts','almond, cashew, walnut, peanut, hazelnut, pecan'],['Eggs','egg, albumin, lecithin'],['Sulphites','sulphite, sulfite, so2, e220, e221, e222']].map(([a, kw]) => (
              <React.Fragment key={a}>
                <div style={{ fontWeight: 900, background: '#FFF8E1', borderRadius: '8px', padding: '6px 10px' }}>{a}</div>
                <div style={{ fontWeight: 600, color: '#555', padding: '6px 4px' }}>{kw}</div>
              </React.Fragment>
            ))}
          </div>
        </Card>
      </motion.div>
    ),

    streak: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Clean Eating Streak</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '28px', lineHeight: 1.7 }}>The streak counter gamifies healthy eating by rewarding consistent days of low-stress food choices.</p>
        <Card accent="#00C896">
          <div style={{ fontWeight: 900, marginBottom: '10px' }}>How it's calculated</div>
          <Step n="1" title="Filter Clean Days" accent="#00C896" desc='All scans with metabolicStressScore < 40 are considered "clean". The unique dates of these scans are collected into a Set.' />
          <Step n="2" title="Walk Backwards" accent="#00C896" desc="Starting from today, the system counts consecutive days that appear in the clean date set. The first missing day (excluding today) breaks the streak." />
          <Step n="3" title="Display & Motivate" accent="#00C896" desc="The streak count drives both the progress bar (7 segments) and the motivational message. Hitting 3+ days turns the card green; 7 days awards the 🏆 Legend badge." />
        </Card>
        <Card accent="#F4C400">
          <div style={{ fontWeight: 900, marginBottom: '10px' }}>Milestone Rewards</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['1–2 days', '💪 Getting started! Scan clean food to build your streak.', '#DDD'],['3–6 days', '🔥 On a roll! Keep going with clean choices.', '#F4C400'],['7+ days', '🏆 7-Day Legend! Peak metabolic discipline.', '#00C896']].map(([d, m, c]) => (
              <div key={d} style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '10px', border: `2px solid ${c}`, alignItems: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '0.8rem', minWidth: '60px', color: c === '#DDD' ? '#666' : c }}>{d}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#444' }}>{m}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    ),

    substitute: (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>Cleaner Alternatives</h2>
        <p style={{ fontWeight: 600, color: '#555', marginBottom: '28px', lineHeight: 1.7 }}>When the scanner detects harmful ingredients in your food history, NutriLens automatically suggests science-backed healthier substitutes.</p>
        <Step n="1" title="Toxin Detection" accent="#FF3A3A" desc="All ingredient names across your entire scan history are collected into a single Set of detected substances." />
        <Step n="2" title="Database Matching" accent="#F4C400" desc="This set is cross-referenced against the SUBSTITUTES database — a curated map of 10 common food toxins to their clean-label alternatives." />
        <Step n="3" title="Live Swap Cards" accent="#00C896" desc="For every toxin detected in your history, a swap card appears showing the harmful ingredient (red) and its clean alternative (green). Cards are fully reactive — new ones appear as you scan more foods." />
        <Card accent="#3B82F6">
          <div style={{ fontWeight: 900, marginBottom: '14px' }}>📚 Full Substitute Reference</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
            {[['High Fructose Corn Syrup','Raw Honey / Maple Syrup'],['Aspartame','Stevia / Monk Fruit'],['Palm Oil','Coconut Oil / Avocado Oil'],['Sodium Nitrite','Celery Powder (Natural Cure)'],['Monosodium Glutamate','Nutritional Yeast / Mushroom Powder'],['Refined Sugar','Coconut Sugar / Jaggery'],['Red 40','Beet Juice / Paprika Extract'],['Carrageenan','Agar-Agar / Tapioca Starch'],['BHA','Vitamin E (Tocopherol)'],['BHT','Rosemary Extract']].map(([bad, good]) => (
              <div key={bad} style={{ background: '#F8F9FA', borderRadius: '10px', padding: '10px 12px', border: '2px solid #EEE' }}>
                <div style={{ fontWeight: 900, fontSize: '0.78rem', color: '#FF3A3A', marginBottom: '3px' }}>✗ {bad}</div>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#00C896' }}>✓ {good}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    ),
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px', alignItems: 'start' }}>
      {/* Sidebar */}
      <div style={{ position: 'sticky', top: '100px' }}>
        <div style={{ fontWeight: 900, fontSize: '0.7rem', color: '#999', letterSpacing: '2px', marginBottom: '16px' }}>USER GUIDE</div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left',
            padding: '10px 14px', marginBottom: '6px', borderRadius: '12px', cursor: 'pointer',
            border: active === s.id ? '2.5px solid #1A1A1A' : '2.5px solid transparent',
            background: active === s.id ? '#1A1A1A' : '#F8F9FA',
            color: active === s.id ? '#F4C400' : '#1A1A1A',
            fontWeight: 900, fontSize: '0.88rem', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '1rem' }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}>
            {sections[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserGuide;
