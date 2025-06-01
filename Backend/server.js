const express = require('express');
const path = require('path');
const {isFileOutdated, downloadFile} = require('./updateCardJSON');
const { findBestPrices } = require('./findBestPrices');


const app = express();
const port = 8000;

app.use(express.json());

// Config
const localFilePath = path.join(__dirname, 'data.json');
const fileURL = 'https://data.scryfall.io/all-cards/all-cards-20250421092255.json'; 
const maxAgeMinutes = 0; //temp value


// Endpoint to check the file is current
app.post('/data', async (req, res) => {
  try {
    if (isFileOutdated(localFilePath, maxAgeMinutes)) {
      console.log('File is outdated or missing. Downloading new file...');
      await downloadFile(fileURL, localFilePath);
    } else {
      console.log('Using current local file.');
    }

    res.status(200).send("Download complete")
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});

app.post('/card', async (req, res) => {
  try {
    const resp = await findBestPrices(req.body)
    console.log("finished")
    res.status(200).send(resp)
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
