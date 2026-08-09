import express from 'express';
import predictHandler from './api/predict.js';

const app = express();
const port = 8085;

app.use(express.json());

// API route
app.post('/api/predict', async (req, res) => {
  try {
    // Call the predict handler directly
    await predictHandler(req, res);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
});