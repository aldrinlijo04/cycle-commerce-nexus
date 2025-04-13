
const express = require('express');
const router = express.Router();
const suppliesController = require('../controllers/suppliesController');

// GET /api/supplies - Get all supplies
router.get('/', suppliesController.getSupplies);

// POST /api/supplies - Create new supply
router.post('/', suppliesController.createSupply);

module.exports = router;
