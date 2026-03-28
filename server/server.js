const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // <--- ADD THIS so the server can read your Task 3 data

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
});

// Task 2: Real-time Collaboration Logic
io.on('connection', (socket) => {
    console.log('A student joined the War-Room:', socket.id);
    socket.on('code-change', (data) => {
        socket.broadcast.emit('receive-code', data);
    });
    socket.on('disconnect', () => console.log('Student left.'));
});

// Task 1: Industry Challenges Data
app.get('/api/challenges', (req, res) => {
    res.json([
        { id: 1, title: "Secure FinTech Login", tech: "MERN Stack" },
        { id: 2, title: "Industrial IoT Dashboard", tech: "React & Python" }
    ]);
});

// --- ADD TASK 3 LOGIC BELOW THIS LINE ---

// Task 3: Bridge Courses (The AI Recommendations)
const bridgeCourses = {
  "logic_error": { 
    title: "Logic & Algorithms 101", 
    videoUrl: "https://www.youtube.com", 
    desc: "Your conditional logic needs a boost! Check out this quick bridge course." 
  },
  "security_error": { 
    title: "Encryption & Security Basics", 
    videoUrl: "https://www.youtube.com",
    desc: "Let's fix that security gap in your FinTech login." 
  }
};

// AI Recommendation Endpoint
app.post('/api/recommend-bridge', (req, res) => {
  const { errorType } = req.body;
  // If we don't recognize the error, we give the logic course as default
  const recommendation = bridgeCourses[errorType] || bridgeCourses["logic_error"];
  res.json(recommendation);
});

// --- END OF TASK 3 LOGIC ---

server.listen(5000, () => console.log("✅ War-Room Server live on port 5000"));
