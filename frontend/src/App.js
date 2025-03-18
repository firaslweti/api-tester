import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const testApi = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);

    const fullUrl = `https://api-tester-4wk3.onrender.com/proxy?url=${encodeURIComponent(url)}&headers=${encodeURIComponent(headers)}`;
    console.log('Fetching:', fullUrl);

    const startTime = Date.now();
    try {
      const res = await axios({
        method: method.toLowerCase(),
        url: fullUrl,
      });
      const timeTaken = Date.now() - startTime;
      console.log('Raw response:', res.data); // Debug log
      setResponse({ ...res.data, time: timeTaken });
      setHistory([{ url, method, time: new Date().toLocaleString() }, ...history.slice(0, 4)]);
    } catch (err) {
      console.error('Frontend error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
          <p className="loader-text">Analyzing API...</p>
        </div>
      )}
      <header className="header">
        <h1>API Pulse Pro</h1>
      </header>
      <main className="main">
        <div className="input-section">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API URL (e.g., https://api.example.com)"
            className="url-input"
          />
          <div className="method-toggle">
            <button
              className={method === 'GET' ? 'active' : ''}
              onClick={() => setMethod('GET')}
            >
              GET
            </button>
            <button
              className={method === 'POST' ? 'active' : ''}
              onClick={() => setMethod('POST')}
            >
              POST
            </button>
          </div>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='Custom Headers (JSON, e.g., {"Authorization": "Bearer token"})'
            className="headers-input"
          />
          <button onClick={testApi} className="test-button">
            Test API
          </button>
        </div>
        <div className="response-section">
          {response && (
            <>
              <p className="success">API Working 🎉</p>
              {response.data ? (
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              ) : (
                <p className="error">No data returned from API</p>
              )}
              <p className="meta">
                Status: {response.status || 'N/A'} {response.statusText || ''} | Time: {response.time}ms
              </p>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </div>
        {history.length > 0 && (
          <div className="history-section">
            <h3>Recent Tests</h3>
            <ul>
              {history.map((item, idx) => (
                <li key={idx}>
                  {item.method} {item.url} - {item.time}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <footer className="footer">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
        ></ins>
      </footer>
    </div>
  );
}

export default App;