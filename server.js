const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Update with your HTML file path
});

// Serve the HTML page
app.get('/signal', (req, res) => {
    res.sendFile(path.join(__dirname, 'signal.html'));  // Update with your HTML file path
});

// Handle the long-running operation
io.on('connection', (socket) => {
    console.log('A client connected');

    // Start long-running operation when requested by the client
    socket.on('startLongRunningOperation', async () => {
        let iterations = 10;
        for (let i = 0; i < iterations; i++) {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work delay
            
            // Send progress update to the client
            socket.emit('receiveProgressUpdate', `Iteration ${i + 1} of ${iterations}... (${(i + 1) * 10}%)`);
        }

        // Notify client when the operation is completed
        socket.emit('operationComplete', 'Operation completed successfully.');
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
