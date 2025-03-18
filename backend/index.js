const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.get('/proxy', async (req, res) => {
  const { url, headers } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.get(url, {
      headers: headers ? JSON.parse(headers) : {},
    });
    const responseData = {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
    console.log('Sending response:', responseData); // Debug log
    res.json(responseData);
  } catch (error) {
    console.error('Backend error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/proxy', async (req, res) => {
  const { url, headers } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.post(url, {}, {
      headers: headers ? JSON.parse(headers) : {},
    });
    const responseData = {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Backend error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});