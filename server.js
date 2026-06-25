const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Reverted to clean, safe standard parsers
app.use(express.json()); 
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

let lastReceivedData = "No data received yet";

app.post('/', (req, res) => {
    console.log("--- NEW TRANSMISSION ---");
    console.log("Body:", req.body);

    let incomingBinary = "00000000";

    // Handle standard JSON objects cleanly
    if (req.body && typeof req.body === 'object') {
        incomingBinary = req.body.value || "00000000";
    } 
    // Handle raw string data if Express doesn't auto-convert it
    else if (req.body && typeof req.body === 'string') {
        try {
            const parsed = JSON.parse(req.body);
            incomingBinary = parsed.value || req.body;
        } catch(e) {
            incomingBinary = req.body;
        }
    }

    lastReceivedData = incomingBinary;
    
    // Respond back securely with the JSON format the game expects
    res.json({ value: String(incomingBinary) });
});

app.get('/', (req, res) => {
    res.send(`Last data from Build Logic: ${lastReceivedData}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
