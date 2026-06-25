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
    
    let incomingBinary = "00000000"; // Fallback default pattern

    if (req.body) {
        if (typeof req.body === 'object' && req.body.value) {
            // If it's a perfectly parsed JSON object
            incomingBinary = req.body.value;
        } else if (typeof req.body === 'string') {
            // If it's a raw string, try to clean it up
            try {
                const parsed = JSON.parse(req.body);
                incomingBinary = parsed.value || req.body;
            } catch (e) {
                incomingBinary = req.body;
            }
        }
    }

    // Save it to your global variable for your GET endpoint
    lastReceivedData = incomingBinary;
    
    // Respond back with a guaranteed string so it NEVER sends nil
    res.json({ value: String(incomingBinary) });
});

// 2. A GET endpoint so you can check your data in a browser
app.get('/', (req, res) => {
    res.send(`Last data from Build Logic: ${lastReceivedData}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
