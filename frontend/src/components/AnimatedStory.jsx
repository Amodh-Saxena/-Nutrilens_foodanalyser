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
              className="scan-now-floating"
              style={{ position: 'absolute', bottom: '10%', right: '-10%' }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
            >
              <img src="/assets/images/chips.png" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1A1A1A' }} alt="Food" />
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Scan Now</div>
              <div style={{ background: '#F4C400', padding: '5px', borderRadius: '50%', border: '2px solid #1A1A1A' }}>
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
          FEATURES SECTION (More Descriptive)
          ============================================= */}
      <section className="neo-section" style={{ background: '#FFFFFF', paddingTop: '80px' }}>
        <div className="neo-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="neo-headline" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
              Why Choose NutriLens?
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto' }}>
              We combine advanced Gemini AI with a comprehensive food additive database to give you the most accurate ingredient analysis available.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            
            {/* Feature 1 */}
            <div className="neo-card" style={{ background: '#E4F4FF' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>Instant Ingredient Detection</h3>
              <p style={{ lineHeight: 1.7, color: '#444' }}>
                Stop squinting at tiny font labels. Our OCR technology reads every single ingredient instantly, identifying hidden chemical names and grouping them by category.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="neo-card" style={{ background: '#FFE4E4' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>Smart Allergy Filtering</h3>
              <p style={{ lineHeight: 1.7, color: '#444' }}>
                Set your dietary profile and we'll automatically flag any ingredients that conflict with your allergies or health goals, from gluten to specific E-numbers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="neo-card" style={{ background: '#E4FFE4' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤖</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>AI-Powered Insights</h3>
              <p style={{ lineHeight: 1.7, color: '#444' }}>
                Go beyond simple facts. Our Gemini-powered AI provides a detailed summary of how specific ingredients impact your unique metabolic health profile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
          HOW IT WORKS (Step-by-Step)
          ============================================= */}
      <section className="neo-section-gray">
        <div className="neo-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="neo-headline" style={{ fontSize: '3rem' }}>How NutriLens Works</h2>
          </div>

          <div style={{ display: 'flex', gap: '40px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            
            {[
              { step: '01', title: 'Capture Label', icon: '📸', desc: 'Snap a clear photo of the ingredients list on any food packaging using our built-in scanner.' },
              { step: '02', title: 'AI Analysis', icon: '🧠', desc: 'Our system identifies additives, preservatives, and nutritional data using our proprietary database.' },
              { step: '03', title: 'Get Scored', icon: '🏆', desc: 'Receive a Metabolic Stress Score and personalized recommendations based on your health profile.' }
            ].map((item, idx) => (
              <div key={idx} style={{ flex: '1 1 300px', background: '#FFF', border: '3.5px solid #1A1A1A', borderRadius: '20px', padding: '40px', boxShadow: '8px 8px 0px #1A1A1A' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F4C400', marginBottom: '20px' }}>{item.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>{item.title}</h3>
                <p style={{ lineHeight: 1.6, color: '#666' }}>{item.desc}</p>
              </div>
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
