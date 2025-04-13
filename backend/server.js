
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const suppliesRoutes = require('./routes/supplies');
const demandsRoutes = require('./routes/demands');
const exchangesRoutes = require('./routes/exchanges');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/supplies', suppliesRoutes);
app.use('/api/demands', demandsRoutes);
app.use('/api/exchanges', exchangesRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Commerce Cycle API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
