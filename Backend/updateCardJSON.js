//We don't want to make a lot of API calls to the scryfall server
//Script to check if the current card DB is current, and update it if not.
const fs = require('fs');
const axios = require('axios')
// Helper: Check if the file is outdated
function isFileOutdated(filePath, maxAgeMinutes) {
  if (!fs.existsSync(filePath)) return true;

  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtimeMs;
  return ageMs > maxAgeMinutes * 60 * 1000;
}

// Helper: Download and save the file
async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('Download complete:', filePath);
      resolve();
    });
    writer.on('error', reject);
  });
}

module.exports = {isFileOutdated, downloadFile};