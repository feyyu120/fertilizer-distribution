const cron = require('cron');
const https = require('https');

const job = new cron.CronJob(
  '*/14 * * * *',           // every 14 minutes
  function () {
    if (!process.env.API_URL) {
      console.warn('API_URL is not defined in environment variables – keep-alive ping skipped');
      return;
    }

    https
      .get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) {
          console.log(`Keep-alive GET successful: ${process.env.API_URL} (status ${res.statusCode})`);
        } else {
          console.warn(`Keep-alive GET failed: ${process.env.API_URL} (status ${res.statusCode})`);
        }
      })
      .on('error', (err) => {
        console.error(`Keep-alive request error for ${process.env.API_URL}:`, err.message);
      });
  },
  null,                        // onComplete (optional – usually null)
  true,                        // start the job right away
  'Africa/Addis_Ababa'         // timezone – good for you in Ethiopia (EAT)
);

console.log(`Keep-alive cron job initialized. Will ping ${process.env.API_URL || 'undefined API_URL'} every 14 minutes`);

// Optional: graceful shutdown (good practice on Render)
process.on('SIGTERM', () => {
  console.log('SIGTERM received – stopping keep-alive cron job');
  job.stop();
});

module.exports = job;
