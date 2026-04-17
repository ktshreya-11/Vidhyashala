import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './App.css';

// Socket connection for real-time collaboration
const socket = io('http://localhost:5000');

function App() {
  // --- 1. CORE APPLICATION STATE ---
  const [screen, setScreen] = useState('landing'); // 'landing', 'auth', 'warroom', 'lab', 'dashboard'
  const [authMode, setAuthMode] = useState('signup'); 
  const [role, setRole] = useState('student'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profilePic, setProfilePic] = useState("https://placeholder.com");
  const [resumeName, setResumeName] = useState("");

  // --- 2. AUTHENTICATION FORM DATA ---
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    password: "",
    college: "",
    year: "",
    company: "",
    experience: ""
  });

  // --- 3. LAB & COLLABORATIVE STATE ---
  const [code, setCode] = useState("// Welcome to Vidhyashala Virtual War-Room...");
  const [bridge, setBridge] = useState(null);
  const [isFaulty, setIsFaulty] = useState(false);

  // --- 4. SOCKET.IO EFFECT ---
  useEffect(() => {
    socket.on('receive-code', (newCode) => {
      setCode(newCode);
    });
    return () => socket.off('receive-code');
  }, []);

  // --- 5. HANDLERS ---
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
    }
  };

  const triggerAI = (type) => {
    axios.post('http://localhost:5000/api/recommend-bridge', { errorType: type })
      .then(res => setBridge(res.data))
      .catch(err => console.error("AI Bridge error:", err));
  };

  const handleSocialAuth = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  return (
    <div className="App">
      {/* --- BLUE FIXED HEADER --- */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => setScreen('landing')} style={{cursor:'pointer'}}>
            <span>VIDHYASHALA</span>
          </div>

          <div className="nav-right">
            <nav className="nav-menu">
              <a href="#home" className={screen === 'landing' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('landing')}>Home</a>
              <a href="#explore" className={screen === 'lab' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('lab')}>Explore Labs</a>
              <a href="#blogs" className={screen === 'blogs' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('blogs')}>Blogs</a>
            </nav>

            <div className="nav-icons">
              <div className="bell-container">
                <span className="bell-icon">🔔</span>
                {bridge && <span className="notif-dot"></span>}
              </div>
              
              <div className="profile-circle" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img src={profilePic} alt="User" />
                {showProfileMenu && (
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-pic-section">
                        <img src={profilePic} alt="Large" className="dropdown-large-pic" />
                        <label htmlFor="upload-input" className="edit-pic-label">Change Photo 📷</label>
                        <input type="file" id="upload-input" hidden onChange={handleImageUpload} accept="image/*" />
                    </div>
                    <hr />
                    <p onClick={() => {setScreen('dashboard'); setShowProfileMenu(false);}} className="dropdown-item">📊 My Dashboard</p>
                    <p onClick={() => {setScreen('auth'); setShowProfileMenu(false);}} className="dropdown-item">🔐 Sign In / Up</p>
                    <hr />
                    <p style={{ color: 'red' }} onClick={() => window.location.reload()} className="dropdown-item">Logout</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content" style={{ marginTop: '70px' }}>
        
        {/* --- SCREEN 1: LANDING --- */}
        {screen === 'landing' && (
          <div className="fade-in" style={{ padding: '60px 8%' }}>
            <header style={{ textAlign: 'center', marginBottom: '80px' }}>
              <p style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '2px' }}>INDUSTRY-VIRTUAL HUB</p>
              <h1 className="hero-title">
                Bridging the Gap Between Learning and Innovation. <br />
                <span style={{ color: '#38bdf8' }}>Where Technology Meets the Future.</span>
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <button className="btn-primary" onClick={() => setScreen('auth')}>JOIN THE HUB</button>
                <button className="btn-secondary" onClick={() => setScreen('lab')}>EXPLORE LABS</button>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div className="glass-card">
                <div style={{ fontSize: '40px' }}>🔬</div>
                <h3>SIMULATED LABS</h3>
                <p>High-fidelity virtual environments for industrial training.</p>
                <button className="btn-secondary" onClick={() => setScreen('lab')}>Enter Lab</button>
              </div>
              <div className="glass-card">
                <div style={{ fontSize: '40px' }}>👥</div>
                <h3>WAR-ROOMS</h3>
                <p>Live collaborative coding and project architecture.</p>
                <button className="btn-secondary" onClick={() => setScreen('warroom')}>Join Hub</button>
              </div>
              <div className="glass-card">
                <div style={{ fontSize: '40px' }}>📜</div>
                <h3>VERIFIED BADGES</h3>
                <p>Earn industry-recognised credentials on completion.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- SCREEN 2: AUTH (SIGNUP/SIGNIN) --- */}
        {screen === 'auth' && (
          <div className="auth-page fade-in">
            <div className="glass-card auth-card">
              <h2>{authMode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
              <div className="role-toggle">
                <button className={role === 'student' ? 'active-role' : ''} onClick={() => setRole('student')}>Student</button>
                <button className={role === 'professional' ? 'active-role' : ''} onClick={() => setRole('professional')}>Professional</button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setScreen('dashboard'); }} className="auth-form">
                <input type="text" placeholder="Full Name" required className="auth-input" />
                <input type="tel" placeholder="Contact Number" required className="auth-input" />
                <input type="email" placeholder="Email Address" required className="auth-input" />
                <input type="password" placeholder="Password" required className="auth-input" />

                {authMode === 'signup' && (
                  role === 'student' ? (
                    <>
                      <input type="text" placeholder="College Name" required className="auth-input" />
                      <input type="number" placeholder="Current Year" required className="auth-input" />
                    </>
                  ) : (
                    <>
                      <input type="text" placeholder="Company Name" required className="auth-input" />
                      <input type="number" placeholder="Years of Experience" required className="auth-input" />
                    </>
                  )
                )}
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  {authMode === 'signup' ? 'Start Journey' : 'Login'}
                </button>
              </form>

              <div className="social-divider"><span>OR CONTINUE WITH</span></div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => handleSocialAuth('google')} className="btn-secondary" style={{ flex: 1, borderColor: '#ea4335', color: '#ea4335' }}>Google</button>
                <button onClick={() => handleSocialAuth('linkedin')} className="btn-secondary" style={{ flex: 1, borderColor: '#0077b5', color: '#0077b5' }}>LinkedIn</button>
              </div>
              <p className="toggle-auth-text" onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}>
                {authMode === 'signup' ? 'Already a member? Sign In' : 'New here? Create an account'}
              </p>
            </div>
          </div>
        )}

        {/* --- SCREEN 3: PERSONALISED DASHBOARD --- */}
        {screen === 'dashboard' && (
          <div className="dashboard-view fade-in" style={{ padding: '40px', color: 'white' }}>
            <h1 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '40px' }}>User Workspace</h1>
            
            <div className="dashboard-grid">
              {/* Profile Overview Card */}
              <div className="glass-card">
                <div style={{ textAlign: 'center' }}>
                  <img src={profilePic} alt="User" className="dashboard-avatar" />
                  <h3 style={{ margin: '15px 0' }}>{role.toUpperCase()}</h3>
                  <div className="status-badge">ONLINE</div>
                </div>
                <div className="profile-stats">
                  <p><strong>Account:</strong> Verified</p>
                  <p><strong>Role:</strong> {role === 'student' ? 'Learner' : 'Expert'}</p>
                </div>
              </div>

              {/* Resume & Career Card */}
              <div className="glass-card">
                <h3>Career Management</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Keep your resume updated for the best industry matches.</p>
                <div className="upload-container">
                  <label htmlFor="res-up" className="resume-box">
                    {resumeName ? `✅ ${resumeName}` : "Click to Upload Resume"}
                  </label>
                  <input type="file" id="res-up" hidden accept=".pdf" onChange={handleResumeUpload} />
                </div>
                {resumeName && <button className="btn-secondary" style={{width:'100%', marginTop:'10px'}} onClick={()=>setResumeName("")}>Remove</button>}
              </div>

              {/* Lab Access Card */}
              <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                <h3>Quick Launch</h3>
                <div className="button-group">
                  <button className="btn-primary" onClick={() => setScreen('lab')}>Launch AI Lab</button>
                  <button className="btn-secondary" onClick={() => setScreen('warroom')}>Virtual War-Room</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SCREEN 4: AI ANOMALY LAB --- */}
        {screen === 'lab' && (
          <div className="lab-view fade-in" style={{ padding: '40px', textAlign: 'center' }}>
            <h2 className="text-blue">🔬 PREDICTIVE MAINTENANCE LAB</h2>
            <div className="glass-card" style={{ maxWidth: '850px', margin: 'auto', padding: '50px' }}>
              <h3 style={{ color: isFaulty ? '#ef4444' : '#f97316' }}>{isFaulty ? "⚠️ ANOMALY DETECTED" : "SYSTEM STABLE"}</h3>
              <div className="pulse-container">
                <div className={isFaulty ? "pulse-line-faulty" : "pulse-line"}></div>
              </div>
              <div className="action-row">
                {!isFaulty ? (
                  <button onClick={() => setIsFaulty(true)} className="btn-primary" style={{background: '#e67e22'}}>INJECT FAULT</button>
                ) : (
                  <button onClick={() => triggerAI('system_crash')} className="btn-primary">GET AI ASSISTANCE</button>
                )}
                <button onClick={() => setScreen('landing')} className="btn-secondary">CLOSE LAB</button>
              </div>
            </div>
          </div>
        )}

        {/* --- SCREEN 5: WAR-ROOM (MONACO) --- */}
        {screen === 'warroom' && (
          <div className="warroom-view fade-in">
            <div className="warroom-nav">
              <span>COLLABORATIVE TERMINAL</span>
              <button onClick={() => setScreen('landing')} className="btn-exit">EXIT ROOM</button>
            </div>
            <div className="editor-wrap">
              <Editor height="calc(100vh - 120px)" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
            </div>
          </div>
        )}

        {/* MODAL: AI BRIDGE */}
        {bridge && (
          <div className="modal-overlay">
            <div className="glass-card modal-content">
              <h2 className="text-orange">AI SKILL ANALYSIS</h2>
              <p>{bridge.desc}</p>
              <div className="video-container">
                <iframe width="100%" height="315" src={bridge.videoUrl} title="AI Bridge" frameBorder="0" allowFullScreen></iframe>
              </div>
              <button onClick={() => setBridge(null)} className="btn-secondary" style={{width:'100%', marginTop:'20px'}}>CONTINUE WORKSPACE</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
