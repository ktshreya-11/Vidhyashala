import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
  const [inWarRoom, setInWarRoom] = useState(false);
  const [code, setCode] = useState("// Type your solution here...");
  const [bridgeCourse, setBridgeCourse] = useState(null); // Task 3: AI Bridge Data

  useEffect(() => {
    socket.on('receive-code', (newCode) => setCode(newCode));
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', value);
  };

  // Task 3: Simulating AI Error Analysis
  const handleSubmit = () => {
    // We simulate a 'logic_error' to trigger the AI Bridge recommendation
    axios.post('http://localhost:5000/api/recommend-bridge', { errorType: 'logic_error' })
      .then(res => {
        setBridgeCourse(res.data);
      })
      .catch(err => console.error("AI Bridge error:", err));
  };

  if (!inWarRoom) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        <h1 style={{ color: '#003366' }}>VIDHYASHALA 🎓</h1>
        <p>bridging the employability gap</p>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          <div style={{ border: '1px solid #ddd', padding: '30px', borderRadius: '15px', width: '400px', backgroundColor: 'white', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2e7d32' }}>1. Secure FinTech Login</h3>
            <button onClick={() => setInWarRoom(true)} style={{ width: '100%', padding: '15px', marginTop: '15px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc' }}> Join Challenge </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', position: 'relative' }}>
      <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><b>War-Room:</b> Secure FinTech Login</span>
        <div>
          <button onClick={handleSubmit} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Submit Code</button>
          <button onClick={() => setInWarRoom(false)} style={{ color: 'white', background: '#e74c3c', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Exit Room</button>
        </div>
      </nav>
      
      <div style={{ flex: 1 }}>
        <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
      </div>

      {/* --- TASK 3: AI BRIDGE POPUP (MODAL) --- */}
      {bridgeCourse && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ color: '#e67e22' }}>⚠️ Test Case Failed</h2>
            <p><b>AI Analysis:</b> {bridgeCourse.desc}</p>
            <h3>Bridge Course: {bridgeCourse.title}</h3>
            <iframe width="100%" height="315" src={bridgeCourse.videoUrl} title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
            <br /><br />
            <button onClick={() => setBridgeCourse(null)} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', background: '#3498db', color: 'white', border: 'none' }}>Close & Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
