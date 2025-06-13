import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  let [input, setInput] = useState('');
  let [results, setResults] = useState([]);
  let [loading, setLoading] = useState(false);

  const updateData = async () => {
    try {
      const response = await axios.post('/data');
      alert('Data updated successfully');
    } catch (err) {
      alert('Error updating data');
      console.error(err);
    }
  };

  const searchCards = async () => {
    const cardNames = input
      .split(/\n/)
      .map(name => name.trim())
      .filter(Boolean);
    console.log(cardNames)
    if (cardNames.length === 0) return;

    try {
      setLoading(true);
      console.log(cardNames)
      const response = await axios.post('/card', cardNames);
      console.log(response.data)
      setResults(response.data);
    } catch (err) {
      alert('Error searching cards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const TotalPrice = () => {
    // Calculate total price
    let total = 0;
    console.log(results)
    results.forEach(card => {
      console.log(card)
      total += parseFloat(card[2]) ?? 0; // Add price if available, otherwise add 0
    }, 0);
    total = total.toFixed(2); // Format to 2 decimal places
    return "$" + total;

  };
  return (
    <div class="root">
      <h1 class="header">Magic Card Finder</h1>
    <div className="app">
      <div class="left-container">
        <div class="search-bar">
          <input type="text" placeholder="Enter card name..." />
          <button>Find Cards</button>
        </div >
        <textarea
          rows={10}
          cols={50}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter card names (newline separated)"
        />
        <br />
        <button onClick={searchCards} disabled={loading}>
          {loading ? 'Searching...' : 'Find Cards'}
        </button>
        <button onClick={updateData} disabled={loading}>
          {'Update Data'}
        </button>
      </div>
       <div class="right-container">
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  width: 'fit-content', float:'center' }}>
          <h2>Results ({results.length}) {TotalPrice()}</h2>
          {
            results.map((card, index) => (
              <div style={{display:'flex', width:'100%'}} key={index} className="card">
                <strong style={{textAlign:'start'}}>{card[0]} ${card[2] ?? 'N/A'} </strong> <p style={{marginLeft: 'auto'}}> {card[1]}</p>
              </div>
            ))
          }
        </div>
      )}
      </div>
    </div>
    </div>
);
}

export default App;
