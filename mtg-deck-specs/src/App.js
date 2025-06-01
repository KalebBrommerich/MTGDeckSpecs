import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  let [input, setInput] = useState('');
  let [results, setResults] = useState([]);
  let [loading, setLoading] = useState(false);

  const searchCards = async () => {
    const cardNames = input
      .split(/\n|,/)
      .map(name => name.trim())
      .filter(Boolean);
    console.log(cardNames)
    if (cardNames.length === 0) return;

    try {
      console.log(cardNames)
      const response =  await axios.post('/card', cardNames);
      console.log(response)
      console.log(response.data)
      setResults(response.data);
    } catch (err) {
      alert('Error searching cards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Magic Card Finder</h1>
      <textarea
        rows={6}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter card names (comma or newline separated)"
      />
      <br />
      <button onClick={searchCards} disabled={loading}>
        {loading ? 'Searching...' : 'Find Cards'}
      </button>

      {results.length > 0 && (
        <div className="results">
          <h2>Results ({results.length})</h2>
          {results.map(card => (
            <div key={card.id} className="card">
              <strong>{card.name}</strong> — {card.set_name} — ${card.prices?.usd ?? 'N/A'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
