import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Connect to Port 3000 (from your image)
const socket = io('http://localhost:3000');

function App() {
  const [inWarRoom, setInWarRoom] = useState(false);
  const [code, setCode] = useState("// Start solving the Secure FinTech Login challenge...");
  const [bridgeCourse, setBridgeCourse] = useState(null);

  useEffect(() => {
    socket.on('receive-code', (newCode) => setCode(newCode));
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', value);
  };

  const handleSubmit = () => {
    // Calling Port 3000
    axios.post('http://localhost:3000/api/recommend-bridge', { errorType: 'logic_error' })
      .then(res => setBridgeCourse(res.data))
      .catch(err => console.error("Submit error:", err));
  };

  if (!inWarRoom) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1>VIDHYASHALA 🎓</h1>
        <div style={{ border: '1px solid #ddd', padding: '30px', borderRadius: '15px', width: '300px', margin: 'auto' }}>
          <h3>Secure FinTech Login</h3>
          <button onClick={() => setInWarRoom(true)} style={{ padding: '10px 20px', cursor: 'pointer', background: '#004a99', color: 'white', border: 'none', borderRadius: '5px' }}>
            Join Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', position: 'relative' }}>
      {/* FIXED NAVIGATION BAR WITH BOTH BUTTONS */}
      <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><b>War-Room:</b> Secure FinTech Login</span>
        <div>
          <button onClick={handleSubmit} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '5px', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold' }}>Submit Code</button>
          <button onClick={() => setInWarRoom(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '5px', cursor: 'pointer' }}>Exit Room</button>
        </div>
      </nav>
      
      <div style={{ flex: 1 }}>
        <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
      </div>

      {/* AI BRIDGE POPUP */}
      {bridgeCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '550px', textAlign: 'left' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>AI Skill Gap Analysis</h2>
            <p style={{ color: '#555', margin: '10px 0' }}>{bridgeCourse.desc}</p>
            <div style={{ border: '1px solid #cce5ff', backgroundColor: '#f8fbff', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Bridge Course: {bridgeCourse.title}</h4>
              <iframe width="100%" height="280" src={bridgeCourse.videoUrl} title="YouTube player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ borderRadius: '5px' }}></iframe>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setBridgeCourse(null)} style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
