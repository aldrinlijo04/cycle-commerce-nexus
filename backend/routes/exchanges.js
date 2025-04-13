
const express = require('express');
const router = express.Router();
const exchangesController = require('../controllers/exchangesController');

// GET /api/exchanges - Get all exchanges
router.get('/', exchangesController.getExchanges);

// POST /api/exchanges - Create new exchange
router.post('/', exchangesController.createExchange);

module.exports = router;
