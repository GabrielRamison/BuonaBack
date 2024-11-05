// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});

app.use(cors());
app.use(express.json());

// Rota de teste básica
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;