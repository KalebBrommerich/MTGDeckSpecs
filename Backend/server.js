const express = require('express');
const axios = require('axios')
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static("Frontend/"))

// Config
const localFilePath = path.join(__dirname, 'data.json');
const fileURL = 'https://data.scryfall.io/all-cards/all-cards-20250421092255.json'; 
const maxAgeMinutes = 60; //temp value

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
    //file is large, await the response
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream', 
    });
  
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
}

// Endpoint to check the file is current
app.get('/data', async (req, res) => {
  try {
    if (isFileOutdated(localFilePath, maxAgeMinutes)) {
      console.log('File is outdated or missing. Downloading new file...');
      await downloadFile(fileURL, localFilePath);
    } else {
      console.log('Using current local file.');
    }

    const data = fs.readFileSync(localFilePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
