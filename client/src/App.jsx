import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [screen, setScreen] = useState('landing'); // 'landing', 'warroom', or 'lab'
  const [code, setCode] = useState("// Welcome to Vidhyashala Virtual War-Room...");
  const [bridge, setBridge] = useState(null);
  const [isFaulty, setIsFaulty] = useState(false); // Added state here

  useEffect(() => {
    socket.on('receive-code', (newCode) => setCode(newCode));
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', value);
  };

  const triggerAI = (type) => {
    axios.post('http://localhost:3000/api/recommend-bridge', { errorType: type })
      .then(res => setBridge(res.data))
      .catch(err => console.error("AI Bridge error:", err));
  };

  // --- SCREEN 1: YOUR ORIGINAL LANDING PAGE ---
  if (screen === 'landing') {
    return (
      <div style={{ padding: '60px 8%' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px' }}>VIDHYASHALA INDUSTRY-VIRTUAL HUB</p>
          <h1 className="hero-title">
            BRIDGE THE GAP. <span style={{ color: '#38bdf8' }}>VIRTUAL LABS,</span> <br />
            REAL-WORLD SKILLS.
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <button className="btn-primary" onClick={() => setScreen('warroom')}>JOIN THE HUB</button>
            <button className="btn-secondary" onClick={() => setScreen('lab')} style={{ borderRadius: '30px' }}>EXPLORE LABS</button>
          </div>
        </header>

        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>HOW IT WORKS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
          <div className="glass-card">
            <div style={{ fontSize: '40px' }}>🔬</div>
            <h4>1. SIMULATED ENVIRONMENTS</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Safe, advanced virtual labs for industrial experimentation.</p>
            <button className="btn-secondary" onClick={() => setScreen('lab')} style={{marginTop:'10px', fontSize:'12px'}}>Enter Lab</button>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '40px' }}>👥</div>
            <h4>2. LIVE COLLABORATION</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Multi-user team projects to solve real-world problems.</p>
            <button className="btn-secondary" onClick={() => setScreen('warroom')} style={{marginTop:'10px', fontSize:'12px'}}>Start Collaborating</button>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '40px' }}>💼</div>
            <h4>3. INDUSTRY CHALLENGES</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Real company projects that bridge the skill-degree gap.</p>
            <button className="btn-secondary" onClick={() => setScreen('warroom')} style={{marginTop:'10px', fontSize:'12px'}}>Enter Challenge</button>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '40px' }}>🔗</div>
            <h4>4. BLOCKCHAIN BADGING</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Verified, immutable certificates for career success.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: THE ANOMALY DETECTION LAB ---
  if (screen === 'lab') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8' }}>🔬 AI LAB: PREDICTIVE MAINTENANCE</h2>
        <div className="glass-card" style={{ maxWidth: '800px', margin: 'auto', padding: '40px' }}>
          <h3 style={{ color: isFaulty ? '#e74c3c' : '#f97316' }}>
            {isFaulty ? "⚠️ ANOMALY DETECTED: IRREGULAR VIBRATION" : "REAL-TIME VIBRATION MONITOR"}
          </h3>
          
          <div className="pulse-container">
              <div className={isFaulty ? "pulse-line-faulty" : "pulse-line"}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', color: 'white', marginTop: '20px' }}>
            <div><h1 style={{margin:0}}>{isFaulty ? "42.1%" : "98.4%"}</h1><p style={{fontSize:'12px'}}>AI CONFIDENCE</p></div>
            <div><h1 style={{margin:0, color: isFaulty ? '#e74c3c' : '#27ae60'}}>{isFaulty ? "CRITICAL" : "NORMAL"}</h1><p style={{fontSize:'12px'}}>STATUS</p></div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            {!isFaulty ? (
              <button onClick={() => setIsFaulty(true)} className="btn-primary" style={{background: '#e67e22'}}>SIMULATE FAULT</button>
            ) : (
              <button onClick={() => triggerAI('anomaly_gap')} className="btn-primary" style={{background: '#38bdf8'}}>NEED HELP? START BRIDGE COURSE</button>
            )}
            <button onClick={() => { setIsFaulty(false); setScreen('landing'); }} className="btn-secondary">EXIT TO HUB</button>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 3: THE VIRTUAL WAR-ROOM ---
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
      <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><b>VIDHYASHALA | War-Room:</b> Secure FinTech Login</span>
        <div>
          <button onClick={() => triggerAI('logic_error')} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold' }}>Submit Code</button>
          <button onClick={() => setScreen('landing')} style={{ color: 'white', background: '#e74c3c', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Exit to Hub</button>
        </div>
      </nav>
      
      <div style={{ flex: 1 }}>
        <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
      </div>

      {bridge && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
    <div className="glass-card" style={{ maxWidth: '600px', backgroundColor: '#1e293b' }}>
      <h2 style={{ color: '#f97316' }}>AI SKILL GAP ANALYSIS</h2>
      <p>{bridge.desc}</p>
      
      {/* THE FIX: Added allow and referrerPolicy for security */}
      <iframe 
        width="100%" 
        height="315" 
        src={bridge.videoUrl} 
        title="AI Bridge Course"
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen 
        style={{ borderRadius: '15px', marginTop: '20px' }}
      ></iframe>
      
      <br /><br />
      <button onClick={() => setBridge(null)} className="btn-secondary" style={{ width: '100%' }}>CLOSE & CONTINUE</button>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
