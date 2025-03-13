const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// List of allowed origins
const allowedOrigins = [
  'http://localhost:4200',
  'https://llys-phys.github.io',
  'https://timeless-sea-website.netlify.app',
  'https://morskobezvremie.bg',
  'http://morskobezvremie.bg',
  'https://www.morskobezvremie.bg',
  'http://www.morskobezvremie.bg'
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow the origin or allow no origin for non-browser requests (like Postman or curl)
      callback(null, true);
    } else {
      // Reject requests from unauthorized origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials like cookies or authorization headers
}));

// Handle preflight requests (OPTIONS)
app.options('*', cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Proxy server is running');
});

// Proxy endpoint for Booking.com calendar
app.get('/api/booking-calendar', async (req, res) => {
  try {
    const responseBooking = await axios.get(
      'https://ical.booking.com/v1/export?t=eff59ee6-b07a-4feb-a94b-28aedf39f0f3',
      {
        responseType: 'text',
        headers: {
          'Accept': 'text/calendar,text/x-vcalendar,application/ics'
        }
      }
    );
    
    // Send Booking calendar data
    res.set('Content-Type', 'text/calendar');
    res.send(responseBooking.data);
  } catch (error) {
    console.error('Error fetching Booking calendar:', error);
    res.status(500).send({
      error: 'Failed to fetch Booking calendar data',
      message: error.message
    });
  }
});

// Proxy endpoint for Airbnb calendar
app.get('/api/airbnb-calendar', async (req, res) => {
  try {
    const responseAirBnb = await axios.get(
      'https://www.airbnb.com/calendar/ical/1161564040928933998.ics?s=c419e36bfdea54d99aa3494d9e1ce491',
      {
        responseType: 'text',
        headers: {
          'Accept': 'text/calendar,text/x-vcalendar,application/ics'
        }
      }
    );
    
    // Send Airbnb calendar data
    res.set('Content-Type', 'text/calendar');
    res.send(responseAirBnb.data);
  } catch (error) {
    console.error('Error fetching Airbnb calendar:', error);
    res.status(500).send({
      error: 'Failed to fetch Airbnb calendar data',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
