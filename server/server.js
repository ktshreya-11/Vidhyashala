const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Essential for Task 3

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// Task 2: Collaboration Logic
io.on('connection', (socket) => {
    socket.on('code-change', (data) => socket.broadcast.emit('receive-code', data));
});

// Task 1: Challenges
app.get('/api/challenges', (req, res) => {
    res.json([{ id: 1, title: "Secure FinTech Login", tech: "MERN Stack" }]);
});

// Task 3: AI Bridge Data (The Video in your Image)
app.post('/api/recommend-bridge', (req, res) => {
    res.json({
        title: "Advanced JWT Authentication and PSD2 Compliance",
        desc: "AI Analysis: We identified a gap in your token verification logic. This course covers implementing secure JSON Web Tokens with proper signature verification and expiry.",
        // THE FIX: Use /embed/ instead of watch?v=
        videoUrl: "https://youtube.com" 
    });
});





server.listen(5000, () => console.log("✅ War-Room Server live on port 5000"));
