import React from 'react';
import { motion } from 'framer-motion';

const AnimatedStory = ({ onComplete }) => {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#FFFFFF', overflowX: 'hidden' }}>
      
      {/* =============================================
          HERO SECTION (MindInventory Style)
          ============================================= */}
      <section
        id="hero"
        style={{
          minHeight: '90vh',
          background: '#F4C400',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '100px 5% 150px',
          overflow: 'hidden'
        }}
      >
        {/* Background Doodles */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/assets/images/doodles.png")',
          backgroundSize: '400px',
          opacity: 0.15,
          pointerEvents: 'none'
        }} />

        <div className="neo-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ 
              fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
              fontWeight: 900, 
              lineHeight: 1, 
              color: '#1A1A1A',
              marginBottom: '20px',
              fontFamily: "'Fredoka', sans-serif"
            }}>
              Find Foods <br />
              You <span className="hero-pill-highlight">Can Eat</span> <br />
              Freely!
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#1A1A1A', 
              opacity: 0.8, 
              maxWidth: '500px', 
              marginBottom: '40px',
              fontWeight: 500,
              lineHeight: 1.6
            }}>
              Create your healthy dietary on your fingertips with us. <br />
              Eat Healthy Stay Healthy.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="btn"
                style={{ 
                  background: '#FFFFFF', 
                  color: '#1A1A1A', 
                  padding: '18px 40px', 
                  fontSize: '1.1rem',
                  borderRadius: '100px',
                  boxShadow: '6px 6px 0px #1A1A1A'
                }}
              >
                Get Started
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ 
                  width: '45px', 
                  height: '45px', 
                  background: '#1A1A1A', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#F4C400'
                }}>
                  ▶
                </span>
                How It Works
              </motion.button>
            </div>
          </motion.div>

          {/* Right Visuals */}
          <div style={{ position: 'relative' }}>
            <motion.img 
              src="/assets/images/hero-person.png" 
              alt="Person" 
              style={{ width: '100%', maxWidth: '500px' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            {/* Floating Elements */}
            <motion.div 
              style={{ 
                position: 'absolute', bottom: '10%', right: '-10%',
                background: '#FFF',
                border: '3px solid #1A1A1A',
                borderRadius: '50px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '6px 6px 0px #1A1A1A',
                cursor: 'pointer',
                zIndex: 10
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
            >
              <div style={{ fontSize: '1.5rem' }}>📷</div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1A1A1A', letterSpacing: '0.5px' }}>SCAN NOW</div>
              <div style={{ background: '#F4C400', width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginLeft: '5px' }}>
                🔬
              </div>
            </motion.div>

            {/* Extra Doodles */}
            <motion.div className="floating-food" style={{ top: '10%', left: '-5%', fontSize: '3rem' }} animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>🍩</motion.div>
            <motion.div className="floating-food" style={{ top: '60%', left: '-15%', fontSize: '2.5rem' }} animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5 }}>🥑</motion.div>
          </div>
        </div>

        {/* Torn Paper Effect */}
        <div className="torn-paper-separator" />
      </section>

      {/* =============================================
          FEATURES SECTION
          ============================================= */}
      <section style={{ background: '#FFFFFF', padding: '120px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '24px', color: '#1A1A1A', fontFamily: "'Fredoka', sans-serif" }}
            >
              Why Choose NutriLens?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '1.25rem', color: '#555', maxWidth: '750px', margin: '0 auto', lineHeight: 1.8, fontWeight: 500 }}
            >
              We combine advanced Gemini AI with a comprehensive food additive database to give you the most accurate ingredient analysis available.
            </motion.p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            
            {[
              { icon: '🔍', title: 'Instant Ingredient Detection', bg: '#E4F4FF', desc: 'Stop squinting at tiny font labels. Our OCR technology reads every single ingredient instantly, identifying hidden chemical names and grouping them by category.' },
              { icon: '🛡️', title: 'Smart Allergy Filtering', bg: '#FFE4E4', desc: "Set your dietary profile and we'll automatically flag any ingredients that conflict with your allergies or health goals, from gluten to specific E-numbers." },
              { icon: '🤖', title: 'AI-Powered Insights', bg: '#E4FFE4', desc: 'Go beyond simple facts. Our Gemini-powered AI provides a detailed summary of how specific ingredients impact your unique metabolic health profile.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: '8px 8px 0px #1A1A1A' }}
                style={{ 
                  background: feature.bg, 
                  border: '3px solid #1A1A1A', 
                  borderRadius: '24px', 
                  padding: '40px 30px', 
                  boxShadow: '4px 4px 0px #1A1A1A',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '24px', background: '#FFF', display: 'inline-block', padding: '15px', borderRadius: '20px', border: '2px solid #1A1A1A', boxShadow: '2px 2px 0px #1A1A1A' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: '#1A1A1A', lineHeight: 1.3 }}>{feature.title}</h3>
                <p style={{ lineHeight: 1.7, color: '#444', fontSize: '1.05rem', fontWeight: 500 }}>{feature.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* =============================================
          HOW IT WORKS SECTION (PLANETONO 3D-STYLE)
          ============================================= */}
      <section style={{ background: '#1A1A1A', padding: '150px 5%', overflow: 'hidden', position: 'relative', perspective: '1200px' }}>
        
        {/* Massive Background Typography */}
        <motion.div 
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ position: 'absolute', top: '5%', left: '-5%', fontSize: '18vw', fontWeight: 900, color: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap', pointerEvents: 'none', lineHeight: 0.8 }}
        >
          SYSTEM
          <br/>LOGIC
        </motion.div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#FFF', fontFamily: "'Fredoka', sans-serif", textShadow: '6px 6px 0px #FF3A3A' }}
            >
              How NutriLens Works
            </motion.h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center' }}>
            
            {[
              { step: '01', title: 'Capture Label', icon: '📸', desc: 'Snap a clear photo of the ingredients list using our optical scanner.', color: '#3B82F6', rotate: '-3deg' },
              { step: '02', title: 'AI Analysis', icon: '🧠', desc: 'Our engine identifies toxic additives using the global NOVA framework.', color: '#F4C400', rotate: '2deg' },
              { step: '03', title: 'Get Scored', icon: '🏆', desc: 'Receive a personalized Metabolic Impact Score instantly.', color: '#00C896', rotate: '-2deg' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, z: -200, rotateY: -30 }}
                whileInView={{ opacity: 1, z: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: idx * 0.2 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateX: 10, 
                  rotateY: -10, 
                  rotateZ: 0,
                  boxShadow: `-15px 20px 0px ${item.color}` 
                }}
                style={{ 
                  background: '#FFF', 
                  border: '4px solid #1A1A1A', 
                  borderRadius: '30px', 
                  padding: '50px 40px', 
                  boxShadow: `8px 12px 0px ${item.color}`,
                  position: 'relative',
                  transform: `rotate(${item.rotate})`,
                  transition: 'box-shadow 0.3s ease',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Floating 3D Node */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '-30px', right: '-20px', width: '80px', height: '80px', background: item.color, border: '4px solid #1A1A1A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '4px 4px 0px #1A1A1A', transform: 'translateZ(50px)' }}
                >
                  {item.icon}
                </motion.div>

                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'transparent', WebkitTextStroke: `2px ${item.color}`, marginBottom: '10px', lineHeight: 1 }}>{item.step}</div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '20px', color: '#1A1A1A', lineHeight: 1.1, transform: 'translateZ(30px)' }}>{item.title}</h3>
                <p style={{ lineHeight: 1.6, color: '#555', fontSize: '1.2rem', fontWeight: 700, transform: 'translateZ(20px)' }}>{item.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* =============================================
          BACKED BY SCIENCE (RESEARCH LINKS)
          ============================================= */}
      <section style={{ background: '#E4F4FF', padding: '120px 5%', borderTop: '3px solid #1A1A1A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#1A1A1A', fontFamily: "'Fredoka', sans-serif" }}
            >
              Backed by Global Research
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '1.25rem', color: '#555', maxWidth: '800px', margin: '15px auto 0', lineHeight: 1.8, fontWeight: 500 }}
            >
              Our algorithmic scoring isn't arbitrary. The NutriLens classification engine is built directly on peer-reviewed toxicological data, metabolic health frameworks, and international health guidelines.
            </motion.p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {[
              { icon: '🏛️', title: 'NOVA Classification System', source: 'University of São Paulo', link: 'https://www.fao.org/3/ca5644en/ca5644en.pdf', desc: 'Our Ultra-Processed severity scoring directly mirrors the internationally recognized NOVA food framework.' },
              { icon: '🔬', title: 'Additive Toxicity Studies', source: 'PubMed Central', link: 'https://pubmed.ncbi.nlm.nih.gov/', desc: 'Over 80+ industrial emulsifiers, artificial colors, and preservatives are mapped against clinical toxicology literature.' },
              { icon: '🌐', title: 'Sugar & Metabolic Guidelines', source: 'World Health Organization (WHO)', link: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet', desc: 'Our High Fructose Corn Syrup and added sugar penalties align with the WHO daily intake limits.' }
            ].map((paper, i) => (
              <motion.a 
                href={paper.link} target="_blank" rel="noopener noreferrer"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: '6px 6px 0px #1A1A1A' }}
                style={{ 
                  textDecoration: 'none',
                  background: '#FFF', 
                  border: '3px solid #1A1A1A', 
                  borderRadius: '20px', 
                  padding: '30px', 
                  display: 'flex', flexDirection: 'column', gap: '15px',
                  boxShadow: '4px 4px 0px #1A1A1A',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>{paper.icon}</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.3 }}>{paper.title}</h3>
                <div style={{ background: '#F4C400', color: '#1A1A1A', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, alignSelf: 'flex-start', border: '2px solid #1A1A1A' }}>
                  SOURCE: {paper.source}
                </div>
                <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>{paper.desc}</p>
                <div style={{ marginTop: 'auto', paddingTop: '15px', color: '#3B82F6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Read Research ↗
                </div>
              </motion.a>
            ))}

          </div>
        </div>
      </section>

      {/* =============================================
          FOOTER
          ============================================= */}
      <footer style={{ background: '#1A1A1A', color: '#FFF', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', fontFamily: "'Fredoka', sans-serif" }}>
          🔬 NutriLens
        </div>
        <p style={{ opacity: 0.6, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
          Empowering you to make informed dietary choices through advanced AI and transparency in the food industry.
        </p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', fontSize: '0.9rem', opacity: 0.4 }}>
          © 2026 NutriLens AI. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default AnimatedStory;
