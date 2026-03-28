import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connecting to your backend

function App() {
  const [inWarRoom, setInWarRoom] = useState(false);
  const [code, setCode] = useState("// Type your solution here...");

  useEffect(() => {
    socket.on('receive-code', (newCode) => setCode(newCode));
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code-change', value);
  };

  if (!inWarRoom) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#003366' }}>VIDHYASHALA 🎓</h1>
        <p>bridging the employability gap</p>
        <hr />
        <h2>Current Industry Challenges</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          {/* Your Secure FinTech Login Card */}
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '15px', width: '350px', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2e7d32' }}>1. Secure FinTech Login</h3>
            <p><b>Goal:</b> Implement two-factor authentication.</p>
            <button 
              onClick={() => setInWarRoom(true)} 
              style={{ width: '100%', padding: '10px', marginTop: '10px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc' }}>
              Join Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Task 2: The Virtual War-Room (Live Editor)
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
      <div style={{ padding: '10px 20px', color: 'white', backgroundColor: '#2c3e50', display: 'flex', justifyContent: 'space-between' }}>
        <span><b>War-Room:</b> Secure FinTech Login</span>
        <button onClick={() => setInWarRoom(false)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Exit</button>
      </div>
      <div style={{ flex: 1 }}>
        <Editor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
      </div>
    </div>
  );
}

export default App;
