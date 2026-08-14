const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const toolRoutes = require('./routes/toolRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ToolCrate API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

module.exports = app;