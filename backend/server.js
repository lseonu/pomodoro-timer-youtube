const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// In-memory store (replace with database in production)
const videoPositions = {};

// Endpoint to get current position
app.get('/api/video-position/:videoId', (req, res) => {
  const position = videoPositions[req.params.videoId] || 0;
  res.json({ position });
});

// Endpoint to update position
app.post('/api/video-position/:videoId', (req, res) => {
  const { position } = req.body;
  videoPositions[req.params.videoId] = position;
  res.json({ success: true });
});

// YouTube proxy endpoint to verify embeddable status
app.get('/api/verify-video/:videoId', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${req.params.videoId}`
    );
    res.json({ embeddable: true });
  } catch (error) {
    res.json({ embeddable: false });
  }
});

// Legacy endpoint for backward compatibility
app.post('/api/validate-video', async (req, res) => {
  const { videoId } = req.body;
  try {
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    res.json({ 
      valid: true,
      embeddable: true,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&modestbranding=1`,
      title: `Video ${videoId}`
    });
  } catch (error) {
    res.json({ 
      valid: false,
      embeddable: false,
      fallbackUrl: `https://www.youtube.com/watch?v=${videoId}`,
      error: 'Video not found or not accessible'
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 