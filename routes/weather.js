import express from 'express';
import fetch from 'node-fetch';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
dotenv.config();

// Fetch weather information for a given location
router.get('/:location', authMiddleware, async (req, res) => {
  const { location } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    const data = await response.json();
    if (!response.ok) {
      res.json(data);router.get('/:location', authMiddleware, async (req, res) => {
        const { location } = req.params;
        const apiKey = process.env.WEATHER_API_KEY;
        try {
          const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
          if (!response.ok) {
            const errorData = await response.json();
            console.error('WeatherAPI Error:', errorData.error.message);
            return res.status(response.status).json({ error: errorData.error.message });
          }
          const data = await response.json();
          res.json(data);
        } catch (err) {
          console.error('Server Error:', err.message);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      
    } else {
      res.status(response.status).json({ error: data.error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
