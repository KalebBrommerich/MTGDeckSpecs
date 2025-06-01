const fs = require('fs');
const path = require('path');
const { parser } = require('stream-json')
const { streamArray } = require('stream-json/streamers/StreamArray');
const filePath = "./Backend/data.json";

/**
 * Filters a large JSON array file to return only cards whose names match the input list.
 * @param {string} filePath - Path to the large JSON file
 * @param {string[]} namesToFind - Array of card names to match
 * @returns {Promise<Object[]>} - List of matching card objects
 */
 async function filterCardsByName(namesToFind) {
  const nameSet = new Set(namesToFind.map(name => name.toLowerCase()));
  console.log(nameSet)
  const matches = [];

  return new Promise((resolve, reject) => {
    const pipeline = fs.createReadStream(filePath)
      .pipe(parser())
      .pipe(streamArray());

    pipeline.on('data', ({ value }) => {
      if (nameSet.has(value.name?.toLowerCase()) && (value.prices.usd != null || value.prices.usd_foil != null || value.prices.usd_etched != null)) {
        matches.push(value);
      }
    });

    pipeline.on('end', () => resolve(matches));
    pipeline.on('error', reject);
  });
}


 async function findBestPrices(cardNames) {
  if(cardNames.length == 0) return
  console.log(cardNames)
  try {
    const results = await filterCardsByName(cardNames);
    let cardList = []
    console.log(`Found ${results.length} matching cards:`);
    results.forEach(card => {
      price = Math.min(card.prices?.usd ?? Infinity, card.prices?.usd_foil ?? Infinity, card.prices?.usd_etched ?? Infinity)
      cardList.push([card.name, card.set, price]);
    });
    tempList = []
    cardList.sort()
    let currentLowest = cardList[0];
    for(let i = 0; i < cardList.length; i++){
      //check if this card is the same name as next
      console.log("Checking " + cardList[i])
      if(cardList[i+1] != null && currentLowest[0] == cardList[i+1][0]){
        if(currentLowest[2]>cardList[i][2])
          currentLowest = cardList[i]
      }else{
        tempList.push(currentLowest)
        currentLowest = cardList[i+1]
      }
    }
    return tempList;
  } catch (err) {
    console.error('Error while filtering cards:',  err);
  }
}

module.exports = { findBestPrices };