const express = require('express');
const fs = require('fs');
const path = require('path');
const dataHandler = require('./utils/dataHandler');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data file exists
dataHandler.ensureDataFile(DATA_FILE);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sample API endpoint
app.get('/api/data', (req, res) => {
  const data = dataHandler.readData(DATA_FILE);
  res.json(data);
});

app.post('/api/data', (req, res) => {
    const newItem = req.body;
  
    if (!newItem || !newItem.name || !newItem.email) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
  
    dataHandler.addData(DATA_FILE, newItem);
    res.status(201).json({ message: 'Data added successfully', item: newItem });
  });
  

// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
