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
    // Build Logic often passes a password or data payload
    console.log("Received data from Build Logic:", req.body);
    
    // Save the data (you can parse it depending on your wire configuration)
    lastReceivedData = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    
    // Respond back to Build Logic so the transmitter registers a successful request
    res.json({ value: "holy fucking shit im swearing in roblox" });
});

// 2. A GET endpoint so you can check your data in a browser
app.get('/', (req, res) => {
    res.send(`Last data from Build Logic: ${lastReceivedData}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
