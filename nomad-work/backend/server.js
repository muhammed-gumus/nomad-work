const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/places', async (req, res) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        keyword: 'cruise',
        location: '-33.8670522,151.1957362',
        radius: 1500,
        type: 'restaurant',
        key: 'YOUR_API_KEY', // Buraya kendi API anahtarınızı ekleyin
      },
    });

    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
