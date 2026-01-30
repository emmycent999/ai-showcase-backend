require('dotenv').config({ silent: true });
const express = require('express');
const cors = require('cors');

console.log('Starting server...');
console.log('All env vars:', Object.keys(process.env));
console.log('Environment check:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  PORT: process.env.PORT
});

const registerRoutes = require('./routes/register');
const validateRoutes = require('./routes/validate');
const voteRoutes = require('./routes/vote');
const adminRoutes = require('./routes/admin');
const certificateRoutes = require('./routes/certificate');
const teamsRoutes = require('./routes/teams');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/register', registerRoutes);
app.use('/api/validate', validateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/teams', teamsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
