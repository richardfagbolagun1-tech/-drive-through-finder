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
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Call Google Places API
        const radiusInMeters = Math.floor(radius * 1609.34);
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusInMeters}&keyword=drive%20through&key=${apiKey}`;

        return new Promise((resolve) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    resolve({
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: data
                    });
                });
            }).on('error', (e) => {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: e.message })
                });
            });
        });
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message })
        };
    }
};
