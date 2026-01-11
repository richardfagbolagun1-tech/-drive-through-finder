const https = require('https');

exports.handler = async (event) => {
    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { lat, lon, radius } = JSON.parse(event.body);
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
 
