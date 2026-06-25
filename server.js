const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// FORCED PARSERS: This handles plain text, JSON, and URL encoded data format varieties
app.use(express.json({ type: '*/*' })); // Forces Express to try parsing everything as JSON
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

let lastReceivedData = "No data received yet";

app.post('/', (req, res) => {
    // 1. CRITICAL DIAGNOSTIC LOGS: Check these in your Render dashboard logs!
    console.log("--- NEW TRANSMISSION RECEIVED ---");
    console.log("Raw Body Type:", typeof req.body);
    console.log("Raw Body Content:", req.body);

    let incomingBinary = "00000000"; 

    // 2. Comprehensive parsing check
    if (req.body) {
        if (typeof req.body === 'object') {
            // Check if the game sent it inside 'value' or directly as keys
            incomingBinary = req.body.value || req.body.POST || "00000000";
        } else if (typeof req.body === 'string') {
            try {
                // If it's a string, see if it's secretly stringified JSON
                const parsed = JSON.parse(req.body);
                incomingBinary = parsed.value || req.body;
            } catch (e) {
                // If it's pure raw text (e.g. just "10000000")
                incomingBinary = req.body;
            }
        }
    }

    // Clean up anything that isn't alphanumeric or clean binary text
    if (typeof incomingBinary === 'object') {
        incomingBinary = JSON.stringify(incomingBinary);
    }

    lastReceivedData = incomingBinary;
    console.log("Extracted Binary Sequence to Send Back:", incomingBinary);
    console.log("---------------------------------");
    
    // Respond back securely
    res.json({ value: String(incomingBinary) });
});

app.get('/', (req, res) => {
    res.send(`Last data from Build Logic: ${lastReceivedData}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
