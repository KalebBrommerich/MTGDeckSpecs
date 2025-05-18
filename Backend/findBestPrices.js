const fs = require('fs');
const path = require('path');
const { parser } = require('stream-json')
const { streamArray } = require('stream-json/streamers/StreamArray');

/**
 * Filters a large JSON array file to return only cards whose names match the input list.
 * @param {string} filePath - Path to the large JSON file
 * @param {string[]} namesToFind - Array of card names to match
 * @returns {Promise<Object[]>} - List of matching card objects
 */
async function filterCardsByName(filePath, namesToFind) {
  const nameSet = new Set(namesToFind.map(name => name.toLowerCase()));
  const matches = [];

  return new Promise((resolve, reject) => {
    const pipeline = fs.createReadStream(filePath)
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }) => {
      if (nameSet.has(value.name?.toLowerCase()) && (value.prices.usd != null || value.prices.usd_foil != null || value.prices.usd_etched != null) ) {
        matches.push(value);
      }
    });

    pipeline.on('end', () => resolve(matches));
    pipeline.on('error', reject);
  });
}

function loadJSON(){

}

function findBestPrices(){

}

(async () => {
  const filePath ="./Backend/data.json";
  const cardNames = ['Black Lotus', 'Lightning Bolt', 'Sol Ring'];

  try {
    const results = await filterCardsByName(filePath, cardNames);
    console.log(`Found ${results.length} matching cards:`);
    results.forEach(card => {
      price = Math.min(card.prices?.usd ?? Infinity,card.prices?.usd_foil ?? Infinity,card.prices?.usd_etched?? Infinity)
      console.log(`- ${card.name} (${card.set_name}) - ${price} `);
    });
  } catch (err) {
    console.error('Error while filtering cards:', err);
  }
})();
module.exports = {findBestPrices};