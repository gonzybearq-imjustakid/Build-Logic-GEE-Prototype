const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Build Logic transmits data as JSON or plain text
app.use(express.json());
app.use(express.text());

// Temporary in-memory variable to store data sent from your game
let lastReceivedData = "No data received yet";

// 1. The POST endpoint where Build Logic will send data
app.post('/', (req, res) => {
    console.log("Received data from Build Logic:", req.body);
    
    // 1. Extract just the raw binary string (e.g., "10101010")
    // If req.body is an object, get req.body.value. Otherwise, use req.body.
    let incomingBinary = typeof req.body === 'object' ? req.body.value : req.body;
    
    // 2. Save it to your global variable
    lastReceivedData = incomingBinary;
    
    // 3. Send just that binary string back to Roblox
    res.json({ value: incomingBinary });
});

// 2. A GET endpoint so you can check your data in a browser
app.get('/', (req, res) => {
    res.send(`Last data from Build Logic: ${lastReceivedData}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
