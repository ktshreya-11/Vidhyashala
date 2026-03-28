const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" }
});

// Task 2: Real-time Collaboration Logic
io.on('connection', (socket) => {
    console.log('A student joined the War-Room:', socket.id);

    // When one student types, send it to the other
    socket.on('code-change', (data) => {
        socket.broadcast.emit('receive-code', data);
    });

    socket.on('disconnect', () => console.log('Student left.'));
});

app.get('/api/challenges', (req, res) => {
    res.json([
        { id: 1, title: "Secure FinTech Login", tech: "MERN Stack" },
        { id: 2, title: "Industrial IoT Dashboard", tech: "React & Python" }
    ]);
});

server.listen(5000, () => console.log("✅ War-Room Server live on port 5000"));
