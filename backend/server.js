import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import eventsRoutes from './routes/events.js';
import rsvpsRoutes from './routes/rsvps.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '../frontend');

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(frontendPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'RSVP API running' });
});

// Routes
app.use('/api/events', eventsRoutes);
app.use('/api/rsvps', rsvpsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
