// routes/weatherRoute.js
import express from 'express';
import axios from 'axios';
import { config } from 'dotenv';

const router = express.Router();

// Middleware to check API key
const checkWeatherApiKey = (req, res, next) => {
    if (!process.env.WEATHER_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'Weather API key not configured' 
        });
    }
    next();
};

// Get current weather by city
router.get('/current', checkWeatherApiKey, async (req, res) => {
    try {
        const { city } = req.query;
        
        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    units: 'metric',
                    appid: process.env.WEATHER_API_KEY
                }
            }
        );

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to fetch weather data'
        });
    }
});

// Get 5-day forecast
router.get('/forecast', checkWeatherApiKey, async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast`,
            {
                params: {
                    q: city,
                    units: 'metric',
                    appid: process.env.WEATHER_API_KEY
                }
            }
        );

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to fetch forecast data'
        });
    }
});

export default router;