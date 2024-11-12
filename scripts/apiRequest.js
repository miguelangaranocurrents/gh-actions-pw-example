const fs = require('fs');
const https = require('https');

const options = {
    hostname: 'api.currents.dev',
    path: `/v1/runs/previous?projectId=${process.env.CURRENTS_PROJECT_ID}&ciBuildId=${process.env.CI_BUILD_ID}&pwLastRun=true`,
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${process.env.CURRENTS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const req = https.request(options, res => {
    let data = '';

    res.on('data', chunk => {
        data += chunk;
    });

    res.on('end', () => {
        fs.writeFileSync('.last-run.json', data);
        console.log('Response saved to .last-run.json');
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();