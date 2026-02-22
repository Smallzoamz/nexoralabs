const http = require('http');

const url = 'http://localhost:3020';
const NUM_REQUESTS = 200;

console.log(`Starting ${NUM_REQUESTS} requests to ${url}...`);

let completed = 0;
let rateLimitedCount = 0;

for (let i = 0; i < NUM_REQUESTS; i++) {
    http.get(url, (res) => {
        completed++;
        if (res.statusCode === 429) {
            rateLimitedCount++;
        }

        if (completed === NUM_REQUESTS) {
            console.log(`Finished testing.`);
            console.log(`Total Requests Sent: ${NUM_REQUESTS}`);
            console.log(`Rate Limited Responses (429): ${rateLimitedCount}`);
            console.log(`Successful Responses: ${NUM_REQUESTS - rateLimitedCount}`);

            if (rateLimitedCount > 0) {
                console.log('✅ Rate limiting is working as expected!');
            } else {
                console.warn('⚠️ Rate limiting might not be working or the threshold is too high.');
            }
        }
    }).on('error', (err) => {
        console.error(`Request ${i} failed:`, err.message);
    });
}
