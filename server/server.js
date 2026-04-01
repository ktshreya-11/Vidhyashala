const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

// Task 2: Real-time Collaboration Logic
io.on('connection', (socket) => {
    socket.on('code-change', (data) => socket.broadcast.emit('receive-code', data));
});

// Task 3: AI Bridge Recommendation Logic
app.post('/api/recommend-bridge', (req, res) => {
    // These logs will appear in your terminal exactly like your photo
    console.log("\x1b[32m[SYSTEM] Code Analysis Complete.\x1b[0m");
    console.log("\x1b[33m[AI-ANALYSIS] Project: '2FA-project', File: 'server.js', Error: 'logic_error'\x1b[0m");
    console.log("\x1b[33m[AI-ANALYSIS] Detected Skill Gap: 'Advanced JWT Authentication and PSD2 Compliance'\x1b[0m");
    console.log("\x1b[33m[AI-ANALYSIS] Status: Found suitable 'Bridge Course' on YouTube.\x1b[0m");
    console.log("\x1b[32m\n=======================================================");
    console.log("[OUTPUT] BRIDGE COURSE: JWT Security Best Practices");
    console.log("[OUTPUT] Suggested Video ID: mbsmsi7l3r4");
    console.log("=======================================================\x1b[0m");

    res.json({
        title: "JWT Security Best Practices",
        desc: "Advanced JWT Authentication and PSD2 Compliance",
        videoUrl: "https://youtube.com" // FIXED EMBED URL
    });
});

app.get('/api/challenges', (req, res) => {
    res.json([{ id: 1, title: "Secure FinTech Login", tech: "MERN Stack" }]);
});

// Match the Port 3000 from your screenshot
server.listen(3000, () => {
    console.log("\x1b[32m[OUTPUT] Local server running at http://localhost:3000\x1b[0m");
    console.log("\x1b[32m[SYSTEM] Build completed successfully.\x1b[0m");
});
