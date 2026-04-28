import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { Upload, Activity, AlertTriangle, CheckCircle, Shield, Droplet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Frontend Intelligence Database (Expanded Dataset)
const LOCAL_DB = {
  "Sweeteners": {
      "sugar": { "severity": "High", "impact": "High blood sugar spike", "explanation": "Refined carbohydrate that drives rapid insulin spikes and fat storage.", "aliases": ["sucrose", "cane sugar", "refined sugar", "liquid sugar", "sugar syrup"] },
      "hfcs": { "severity": "Extreme", "impact": "Hepatic fat driver", "explanation": "High Fructose Corn Syrup metabolizes directly in the liver, promoting fatty liver disease.", "aliases": ["high fructose corn syrup", "corn syrup", "fructose syrup", "glucose syrup", "liquid glucose"] },
      "maltodextrin": { "severity": "High", "impact": "Extremely high GI", "explanation": "A highly processed polysaccharide with a higher glycemic index than table sugar.", "aliases": ["maltodextrine"] },
      "invert sugar": { "severity": "High", "impact": "Rapid absorption", "explanation": "Liquid sugar that bypasses early digestion stages.", "aliases": ["invert syrup", "golden syrup"] },
      "aspartame": { "severity": "Extreme", "impact": "Neuro-metabolic stressor", "explanation": "Artificial sweetener linked to sensitivities and microbiome disruption.", "aliases": ["ins 951", "e951", "nutrasweet", "equal"] },
      "sucralose": { "severity": "High", "impact": "Microbiome disruptor", "explanation": "Synthetic sweetener that can negatively alter gut bacteria.", "aliases": ["ins 955", "e955", "splenda"] },
      "erythritol": { "severity": "Low", "impact": "Sugar alcohol", "explanation": "Zero-calorie sweetener. Generally safe, though may cause digestive issues in large amounts.", "aliases": ["ins 968", "e968"] },
      "stevia": { "severity": "Low", "impact": "Natural zero-calorie", "explanation": "Plant-derived sweetener. Does not spike blood sugar.", "aliases": ["steviol glycosides", "ins 960", "e960"] }
  },
  "Industrial Fats & Oils": {
      "palm oil": { "severity": "High", "impact": "High saturated fat", "explanation": "Highly processed, pro-inflammatory oil often used for extending shelf life.", "aliases": ["palmolein", "refined palmolein", "vegetable fat (palm)", "palm fat", "fractionated palm oil"] },
      "vegetable oil": { "severity": "Moderate", "impact": "High Omega-6", "explanation": "Can drive chronic inflammation if not balanced with Omega-3s.", "aliases": ["vegetable fat", "refined vegetable oil", "edible vegetable oil", "hydrogenated vegetable oil", "partially hydrogenated"] },
      "soybean oil": { "severity": "Moderate", "impact": "Pro-inflammatory", "explanation": "Rich in Omega-6. Common industrial filler oil.", "aliases": ["soy oil", "refined soybean oil", "soya oil"] },
      "canola oil": { "severity": "Moderate", "impact": "Highly processed", "explanation": "Often extracted using chemical solvents like hexane.", "aliases": ["rapeseed oil", "refined rapeseed"] },
      "sunflower oil": { "severity": "Low", "impact": "Cooking oil", "explanation": "Common seed oil. Safe in moderation but high in Omega-6.", "aliases": ["refined sunflower oil", "sunflower seed oil"] }
  },
  "Emulsifiers & Thickeners": {
      "lecithin": { "severity": "Low", "impact": "Neutral stabilizer", "explanation": "Used to bind fat and water. Generally safe in small amounts.", "aliases": ["soy lecithin", "soya lecithin", "ins 322", "e322", "emulsifier 322", "emulsifier"] },
      "modified starch": { "severity": "Moderate", "impact": "High glycemic texturizer", "explanation": "Chemically altered starch that behaves like a fast-digesting carbohydrate.", "aliases": ["ins 1442", "ins 1422", "e1422", "modified maize starch", "acetylated distarch adipate"] },
      "xanthan gum": { "severity": "Low", "impact": "Thickening agent", "explanation": "Bacterial fermentation product. Safe, but can cause bloating in high doses.", "aliases": ["ins 415", "e415", "thickener 415"] },
      "carrageenan": { "severity": "High", "impact": "Intestinal irritant", "explanation": "Seaweed extract highly correlated with gastrointestinal inflammation.", "aliases": ["ins 407", "e407"] },
      "guar gum": { "severity": "Low", "impact": "Natural thickener", "explanation": "Fiber-like plant extract. Generally very safe.", "aliases": ["ins 412", "e412"] },
      "pectin": { "severity": "Low", "impact": "Natural fiber", "explanation": "Fruit-derived fiber used as a gelling agent.", "aliases": ["ins 440", "e440"] }
  },
  "Preservatives": {
      "sodium benzoate": { "severity": "High", "impact": "Potential cellular stressor", "explanation": "Synthetic preservative. Can form benzene (a carcinogen) when mixed with Vitamin C.", "aliases": ["ins 211", "e211"] },
      "potassium sorbate": { "severity": "Low", "impact": "Mild preservative", "explanation": "Used to prevent mold growth. Safe for most metabolic profiles.", "aliases": ["ins 202", "e202"] },
      "calcium propionate": { "severity": "Low", "impact": "Anti-fungal", "explanation": "Commonly used in bread to prevent mold. Generally recognized as safe.", "aliases": ["ins 282", "e282"] },
      "sodium nitrite": { "severity": "Extreme", "impact": "Carcinogen risk", "explanation": "Curing agent in meats. Forms harmful nitrosamines when cooked at high heat.", "aliases": ["ins 250", "e250", "nitrates"] },
      "bha": { "severity": "High", "impact": "Endocrine disruptor", "explanation": "Synthetic antioxidant used to prevent fats from going rancid. Linked to hormone disruption.", "aliases": ["butylated hydroxyanisole", "ins 320", "e320"] }
  },
  "Flavor Enhancers": {
      "msg": { "severity": "Moderate", "impact": "Excitotoxin risk", "explanation": "Monosodium Glutamate. Can cause headaches or sensitivity in some individuals.", "aliases": ["monosodium glutamate", "ins 621", "e621", "flavor enhancer 621"] },
      "yeast extract": { "severity": "Low", "impact": "Natural savory flavor", "explanation": "Contains naturally occurring glutamates. Safer alternative to synthetic MSG.", "aliases": ["autolyzed yeast", "nutritional yeast"] },
      "artificial flavors": { "severity": "Moderate", "impact": "Unknown chemical soup", "explanation": "Proprietary chemical mixtures used to simulate natural tastes.", "aliases": ["artificial flavouring", "artificial flavour", "synthetic flavors"] }
  },
  "Artificial Colors": {
      "red 40": { "severity": "High", "impact": "Behavioral disruptor", "explanation": "Synthetic petroleum-derived dye. Linked to hyperactivity in children.", "aliases": ["allura red", "ins 129", "e129"] },
      "yellow 5": { "severity": "High", "impact": "Allergenic dye", "explanation": "Tartrazine. Known to cause allergic reactions and asthma symptoms in sensitive people.", "aliases": ["tartrazine", "ins 102", "e102"] },
      "caramel color": { "severity": "Moderate", "impact": "Potential contaminant", "explanation": "Depending on how it's processed, can contain 4-MEI, a possible carcinogen.", "aliases": ["ins 150", "e150", "ins 150d", "e150d"] }
  },
  "Acidity Regulators": {
      "citric acid": { "severity": "Low", "impact": "pH Balancer", "explanation": "Natural or mold-derived acid used for tartness and preservation.", "aliases": ["ins 330", "e330", "acidity regulator 330"] },
      "malic acid": { "severity": "Low", "impact": "Tart flavor", "explanation": "Naturally occurs in fruits like apples. Completely safe.", "aliases": ["ins 296", "e296"] },
      "sodium bicarbonate": { "severity": "Low", "impact": "Leavening agent", "explanation": "Baking soda. Used to help dough rise.", "aliases": ["ins 500", "e500", "baking soda", "raising agent"] }
  },
  "Protein Sources": {
      "whey protein": { "severity": "Low", "impact": "Fast-absorbing protein", "explanation": "High-quality dairy protein rich in essential amino acids.", "aliases": ["whey concentrate", "whey isolate", "milk protein"] },
      "soy protein": { "severity": "Moderate", "impact": "Plant protein", "explanation": "Complete protein, but highly processed isolates can cause digestive issues.", "aliases": ["soy isolate", "soy protein isolate", "textured soy"] },
      "pea protein": { "severity": "Low", "impact": "Hypoallergenic protein", "explanation": "Easily digestible plant protein without common allergens.", "aliases": ["pea isolate"] }
  },
  "Natural Ingredients": {
      "wheat flour": { "severity": "Moderate", "impact": "Refined grain", "explanation": "Stripped of fiber and nutrients. Digests rapidly into sugar.", "aliases": ["refined wheat flour", "maida", "enriched flour", "wheat"] },
      "whole wheat": { "severity": "Low", "impact": "Complex carbohydrate", "explanation": "Contains fiber which slows digestion and feeds gut microbiome.", "aliases": ["whole grain wheat", "atta"] },
      "water": { "severity": "Low", "impact": "Hydration", "explanation": "Essential for all biological functions.", "aliases": ["purified water", "aqua"] },
      "salt": { "severity": "Moderate", "impact": "Sodium source", "explanation": "Essential mineral, but industrial food salt often lacks trace minerals.", "aliases": ["sodium chloride", "iodized salt", "edible salt", "rock salt"] },
      "milk solids": { "severity": "Low", "impact": "Dairy component", "explanation": "Dried milk powder used for flavor and texture.", "aliases": ["skimmed milk powder", "whole milk powder", "dairy solids"] },
      "cocoa solids": { "severity": "Low", "impact": "Antioxidant source", "explanation": "Derived from cacao beans. Rich in flavonoids.", "aliases": ["cocoa mass", "cocoa powder", "cacao"] },
      "oats": { "severity": "Low", "impact": "Soluble fiber", "explanation": "Heart-healthy complex carbohydrate that regulates blood sugar.", "aliases": ["rolled oats", "oatmeal", "whole oats"] }
  }
};

const CATEGORY_COLORS = { 'Good': '#00C853', 'Bad': '#FF3D00' };

// Subtractive Parser
const parseIngredientsLocal = (rawText) => {
    let text = rawText.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Aggressive Stop-Word Filter
    const STOP_WORDS = ['biscuits', 'biscuit', 'common', 'contains', 'ingredients', 'label', 'manufactured', 'packaged', 'weight', 'net', 'mrp', 'inclusive', 'taxes', 'edible', 'added', 'permitted', 'synthetic', 'nature', 'identical', 'flavouring', 'substances'];
    
    STOP_WORDS.forEach(word => {
        text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), ' ');
    });
    text = text.replace(/\s+/g, ' ').trim();

    let matchedAnalysis = [];
    let processedNames = new Set();
    let remainingText = text;

    for (let category in LOCAL_DB) {
        for (let dbKey in LOCAL_DB[category]) {
            const entry = LOCAL_DB[category][dbKey];
            const searchTargets = [dbKey, ...(entry.aliases || [])].sort((a, b) => b.length - a.length);

            for (let target of searchTargets) {
                if (remainingText.includes(target.toLowerCase())) {
                    const standardizedName = dbKey.toUpperCase();
                    if (!processedNames.has(standardizedName)) {
                        matchedAnalysis.push({
                            name: standardizedName,
                            category: category,
                            severity: entry.severity,
                            impact: entry.impact,
                            explanation: entry.explanation
                        });
                        processedNames.add(standardizedName);
                    }
                    remainingText = remainingText.replace(new RegExp(target.toLowerCase(), 'gi'), ' ');
                    break;
                }
            }
        }
    }

    return matchedAnalysis;
};

const V2Scanner = () => {
  const [status, setStatus] = useState('IDLE');
  const [progress, setProgress] = useState('');
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleScan = async (file) => {
    setStatus('SCANNING');
    setResults(null);
    
    try {
      let extractedText = "";
      
      if (file === 'MOCK') {
        setProgress('Injecting Diagnostic Data...');
        await new Promise(r => setTimeout(r, 1000));
        extractedText = "Ingredients: Refined Wheat flour, Sugar, Edible Vegetable Oil, High Fructose Corn Syrup, Leavening Agents, Salt, Soy Lecithin, Red 40";
      } else {
        setProgress('Configuring Optical Engine...');
        const result = await Tesseract.recognize(file, 'eng', { 
          logger: m => {
            if (m.status === 'recognizing text') setProgress(`Extracting Data: ${Math.round(m.progress * 100)}%`);
          }
        });
        extractedText = result.data.text;
      }

      setProgress('Running Metabolic Autopsy...');
      await new Promise(r => setTimeout(r, 800));

      const parsedComponents = parseIngredientsLocal(extractedText);
      
      let stress = 100;
      let hasUltraProcessed = false;
      parsedComponents.forEach(c => {
        if (c.severity === 'High') stress -= 15;
        if (c.severity === 'Extreme') stress -= 25;
        if (['Additives', 'Preservatives', 'Emulsifiers', 'Industrial Fats & Oils', 'Artificial Colors'].includes(c.category)) {
            stress -= 5;
            hasUltraProcessed = true;
        }
      });

      setResults({
        rawText: extractedText,
        components: parsedComponents,
        stressScore: Math.min(100, Math.max(0, stress)),
        novaClass: hasUltraProcessed ? "NOVA 4 (Ultra-Processed)" : "NOVA 1-3 (Minimally Processed)"
      });
      
      setStatus('DONE');
    } catch (err) {
      console.error(err);
      alert('Scanning failed. Please try again.');
      setStatus('IDLE');
    }
  };

  const renderInfographic = () => {
    if (!results) return null;

    // Data Calculation
    let goodCount = 0, badCount = 0;
    const severityCounts = { Low: 0, Moderate: 0, High: 0, Extreme: 0 };

    results.components.forEach(c => {
      if (['Natural Ingredients', 'Protein Sources'].includes(c.category)) goodCount++;
      else badCount++;

      if (severityCounts[c.severity] !== undefined) severityCounts[c.severity]++;
    });

    const pieData = [];
    if (goodCount > 0) pieData.push({ name: 'Good', value: goodCount });
    if (badCount > 0) pieData.push({ name: 'Bad', value: badCount });

    const severityData = [
      { name: 'Low', count: severityCounts.Low, fill: '#00C853' },
      { name: 'Moderate', count: severityCounts.Moderate, fill: '#F4C400' },
      { name: 'High', count: severityCounts.High, fill: '#FF9100' },
      { name: 'Extreme', count: severityCounts.Extreme, fill: '#D50000' }
    ];

    let verdict = { text: "Generally Safe", color: "#00C853", icon: <Shield size={30} /> };
    if (results.stressScore < 70) verdict = { text: "Consume in Moderation", color: "#F4C400", icon: <Activity size={30} /> };
    if (results.stressScore < 40) verdict = { text: "High Metabolic Risk - Avoid", color: "#D50000", icon: <AlertTriangle size={30} /> };

    const gaugeData = [
      { name: 'Score', value: results.stressScore, fill: verdict.color },
      { name: 'Empty', value: 100 - results.stressScore, fill: '#F5F5F5' }
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px', paddingBottom: '100px' }}>
        
        {/* HEADER INFOGRAPHIC */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1A1A1A', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '-1px' }}>Metabolic Profile</h1>
          <p style={{ opacity: 0.5, fontWeight: 700, fontSize: '1.2rem', marginTop: 0 }}>Automated Optical Composition Analysis</p>
        </div>

        {/* TOP ROW: GAUGE & VERDICT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
            
            {/* HEALTH SCORE GAUGE */}
            <div style={{ background: '#FFF', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative' }}>
                <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem', color: '#1A1A1A' }}>Systemic Health Score</h3>
                <div style={{ height: '250px', marginTop: '-20px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={gaugeData} cx="50%" cy="80%" startAngle={180} endAngle={0} innerRadius={80} outerRadius={110} dataKey="value" stroke="none" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 900, color: verdict.color, lineHeight: '1' }}>{results.stressScore}</div>
                    <div style={{ fontWeight: 800, color: '#9E9E9E', letterSpacing: '2px' }}>OUT OF 100</div>
                </div>
            </div>

            {/* VERDICT & NOVA SCORE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ flex: 1, background: verdict.color, color: '#FFF', padding: '40px 30px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: `0 15px 40px ${verdict.color}40` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        {verdict.icon}
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{verdict.text}</h2>
                    </div>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>
                        Based on the detection of {results.components.length} biochemical components and processing agents.
                    </p>
                </div>

                <div style={{ background: '#1A1A1A', color: '#FFF', padding: '30px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Droplet size={40} color="#F4C400" />
                    <div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Processing Level</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{results.novaClass}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* MIDDLE ROW: DATA VISUALIZATIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
            {/* RATIO PIE */}
            <div style={{ background: '#FFF', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <h3 style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.4rem', color: '#1A1A1A', marginBottom: '20px' }}>Component Origin Ratio</h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((e, i) => <Cell key={i} fill={CATEGORY_COLORS[e.name] || '#9E9E9E'} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 800, border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 800 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
            </div>

            {/* SEVERITY BAR CHART */}
            <div style={{ background: '#FFF', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <h3 style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.4rem', color: '#1A1A1A', marginBottom: '20px' }}>Toxicity Severity Profile</h3>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 800, fontSize: 12, fill: '#666' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 800, fontSize: 12, fill: '#666' }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#F5F5F5' }} contentStyle={{ borderRadius: '12px', fontWeight: 800, border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* BOTTOM ROW: AUDIT LIST */}
        <div style={{ background: '#FFF', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontWeight: 900, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.8rem', borderBottom: '2px solid #F5F5F5', paddingBottom: '20px' }}>
                <Activity color="#1A1A1A" size={30} /> Categorized Ingredient Audit
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {results.components.length === 0 && (
                    <div style={{ padding: '20px', background: '#F8F9FA', borderRadius: '16px', color: '#666', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                        No specific ingredients could be identified from this scan.
                    </div>
                )}
                
                {Object.entries(
                results.components.reduce((acc, c) => {
                    if (!acc[c.category]) acc[c.category] = [];
                    acc[c.category].push(c);
                    return acc;
                }, {})
                ).map(([category, items], idx) => {
                const isGoodCategory = ['Natural Ingredients', 'Protein Sources'].includes(category);
                
                return (
                    <div key={idx} style={{ background: '#F8F9FA', borderRadius: '20px', border: '1px solid #EEE', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ background: isGoodCategory ? '#E8F5E9' : '#FFEBEE', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: isGoodCategory ? '#2E7D32' : '#C62828' }}>{category}</h3>
                            <div style={{ background: isGoodCategory ? '#2E7D32' : '#C62828', color: '#FFF', padding: '3px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 900 }}>{items.length}</div>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                            {items.map((c, i) => (
                                <div key={i} style={{ borderBottom: i !== items.length - 1 ? '1px solid #EEE' : 'none', paddingBottom: i !== items.length - 1 ? '15px' : '0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1A1A1A' }}>{c.name}</div>
                                        <div style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', background: isGoodCategory ? '#E8F5E9' : '#FFEBEE', color: isGoodCategory ? '#2E7D32' : '#C62828', fontWeight: 900, textTransform: 'uppercase' }}>
                                            {c.severity}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600, marginTop: '8px' }}>{c.impact}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                })}
            </div>
        </div>

        {/* COMPREHENSIVE METHODOLOGY INFOGRAPHIC */}
        <div style={{ background: '#FFF', padding: '50px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center', fontWeight: 900, marginBottom: '50px', fontSize: '2.5rem', color: '#1A1A1A', letterSpacing: '-1px' }}>
                Clinical Diagnostic Framework
            </h2>

            {/* Section 1: Scoring */}
            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ borderBottom: '3px solid #F5F5F5', paddingBottom: '15px', marginBottom: '25px', fontWeight: 900, fontSize: '1.5rem', color: '#1A1A1A' }}>1. Systemic Health Score Algorithm</h3>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '25px', fontWeight: 500 }}>Every product begins with a perfect score of 100. Subtractive penalties are applied based on biological stress:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div style={{ background: '#FFF1F0', border: '2px solid #FFCCC7', padding: '30px 20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 20px rgba(207, 19, 34, 0.05)' }}>
                        <h2 style={{ color: '#CF1322', margin: '0 0 15px 0', fontSize: '3.5rem', fontWeight: 900, lineHeight: '1' }}>-25</h2>
                        <div style={{ fontWeight: 900, color: '#CF1322', fontSize: '1.2rem' }}>Extreme Threat</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '15px', fontWeight: 500 }}>Toxic disruptors.<br/><i>(e.g., HFCS, Aspartame, Nitrites)</i></div>
                    </div>
                    <div style={{ background: '#FFF7E6', border: '2px solid #FFE7BA', padding: '30px 20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 20px rgba(212, 107, 8, 0.05)' }}>
                        <h2 style={{ color: '#D46B08', margin: '0 0 15px 0', fontSize: '3.5rem', fontWeight: 900, lineHeight: '1' }}>-15</h2>
                        <div style={{ fontWeight: 900, color: '#D46B08', fontSize: '1.2rem' }}>High Threat</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '15px', fontWeight: 500 }}>Inflammatory agents.<br/><i>(e.g., Refined Sugar, Palm Oil, Red 40)</i></div>
                    </div>
                    <div style={{ background: '#F9F0FF', border: '2px solid #EFDBFF', padding: '30px 20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 20px rgba(83, 29, 171, 0.05)' }}>
                        <h2 style={{ color: '#531DAB', margin: '0 0 15px 0', fontSize: '3.5rem', fontWeight: 900, lineHeight: '1' }}>-5</h2>
                        <div style={{ fontWeight: 900, color: '#531DAB', fontSize: '1.2rem' }}>Industrial Agent</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '15px', fontWeight: 500 }}>Every single chemical additive, thickener, or preservative detected.</div>
                    </div>
                </div>
            </div>

            {/* Section 2: NOVA */}
            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ borderBottom: '3px solid #F5F5F5', paddingBottom: '15px', marginBottom: '25px', fontWeight: 900, fontSize: '1.5rem', color: '#1A1A1A' }}>2. NOVA Classification Engine</h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', background: '#FAFAFA', border: '1px solid #EEE', padding: '35px', borderRadius: '24px', borderTop: '8px solid #D50000', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#D50000', fontSize: '1.4rem', fontWeight: 900 }}>🔴 NOVA 4 (Ultra-Processed)</h4>
                        <p style={{ fontSize: '1rem', color: '#444', lineHeight: '1.7', marginBottom: '15px' }}><strong>Trigger:</strong> Detected Preservatives, Emulsifiers, Industrial Fats, Artificial Colors, or Flavor Enhancers.</p>
                        <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.7', margin: 0 }}><strong>Rationale:</strong> Proves the food was industrially engineered for shelf-life, hyper-palatability, or cost reduction.</p>
                    </div>
                    <div style={{ flex: 1, minWidth: '300px', background: '#FAFAFA', border: '1px solid #EEE', padding: '35px', borderRadius: '24px', borderTop: '8px solid #00C853', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#00C853', fontSize: '1.4rem', fontWeight: 900 }}>🟢 NOVA 1-3 (Minimally Processed)</h4>
                        <p style={{ fontSize: '1rem', color: '#444', lineHeight: '1.7', marginBottom: '15px' }}><strong>Trigger:</strong> No industrial chemicals detected.</p>
                        <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.7', margin: 0 }}><strong>Rationale:</strong> Consists entirely of whole foods, simple culinary ingredients (salt/sugar), or basic processing.</p>
                    </div>
                </div>
            </div>

            {/* Section 3: Severity */}
            <div>
                <h3 style={{ borderBottom: '3px solid #F5F5F5', paddingBottom: '15px', marginBottom: '25px', fontWeight: 900, fontSize: '1.5rem', color: '#1A1A1A' }}>3. Toxicity Severity Tiers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div style={{ background: '#E8F5E9', padding: '25px', borderRadius: '20px', border: '1px solid #C8E6C9' }}>
                        <div style={{ fontWeight: 900, color: '#2E7D32', fontSize: '1.2rem', marginBottom: '12px' }}>🟢 LOW (Safe/Natural)</div>
                        <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>Human biology is evolved to digest these safely. <br/><br/><i>(e.g. Oats, Water, Whey)</i></div>
                    </div>
                    <div style={{ background: '#FFF8E1', padding: '25px', borderRadius: '20px', border: '1px solid #FFECB3' }}>
                        <div style={{ fontWeight: 900, color: '#F57F17', fontSize: '1.2rem', marginBottom: '12px' }}>🟡 MODERATE (Caution)</div>
                        <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>Drives inflammation or insulin spikes if overconsumed. <br/><br/><i>(e.g. Wheat Flour, MSG)</i></div>
                    </div>
                    <div style={{ background: '#FFF3E0', padding: '25px', borderRadius: '20px', border: '1px solid #FFE0B2' }}>
                        <div style={{ fontWeight: 900, color: '#E65100', fontSize: '1.2rem', marginBottom: '12px' }}>🟠 HIGH (Disruptor)</div>
                        <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>Spikes insulin, disrupts microbiome, or causes hyperactivity. <br/><br/><i>(e.g. Sugar, Palm Oil, Red 40)</i></div>
                    </div>
                    <div style={{ background: '#FFEBEE', padding: '25px', borderRadius: '20px', border: '1px solid #FFCDD2' }}>
                        <div style={{ fontWeight: 900, color: '#C62828', fontSize: '1.2rem', marginBottom: '12px' }}>🔴 EXTREME (Severe Risk)</div>
                        <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>Linked to chronic illness, organ stress, or carcinogenicity. <br/><br/><i>(e.g. HFCS, Aspartame, Nitrites)</i></div>
                    </div>
                </div>
            </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button onClick={() => setStatus('IDLE')} style={{ background: '#1A1A1A', color: '#FFF', padding: '18px 50px', borderRadius: '50px', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            SCAN NEW LABEL
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F8', paddingTop: '100px', paddingBottom: '50px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {status === 'IDLE' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '15px', color: '#1A1A1A', letterSpacing: '-1.5px' }}>NutriLens V2</h1>
            <p style={{ fontSize: '1.3rem', opacity: 0.6, marginBottom: '60px', fontWeight: 500 }}>High-Fidelity Optical Metabolic Scanner</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ background: '#FFF', padding: '50px', borderRadius: '30px', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', cursor: 'pointer', width: '320px', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: '#1A1A1A', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                  <Upload color="#FFF" size={36} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1A1A1A' }}>UPLOAD LABEL</h3>
                <p style={{ color: '#888', fontWeight: 500, fontSize: '0.95rem', margin: '10px 0 0 0' }}>Extract data from a photo</p>
                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && handleScan(e.target.files[0])} style={{ display: 'none' }} accept="image/*" />
              </div>

              <div 
                onClick={() => handleScan('MOCK')}
                style={{ background: '#FFF', padding: '50px', borderRadius: '30px', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', cursor: 'pointer', border: '3px solid #F4C400', width: '320px', transition: 'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ background: '#F4C400', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                  <Activity color="#1A1A1A" size={36} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1A1A1A' }}>RUN DIAGNOSTIC</h3>
                <p style={{ color: '#888', fontWeight: 500, fontSize: '0.95rem', margin: '10px 0 0 0' }}>Test with simulated data</p>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'SCANNING' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '150px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ width: '100px', height: '100px', border: '10px solid #EEE', borderTopColor: '#1A1A1A', borderRadius: '50%', margin: '0 auto 40px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-1px' }}>{progress}</h2>
          </motion.div>
        )}

        {status === 'DONE' && renderInfographic()}

      </div>
    </div>
  );
};

export default V2Scanner;
