
const express = require('express');
const router = express.Router();
const demandsController = require('../controllers/demandsController');

// GET /api/demands - Get all demands
router.get('/', demandsController.getDemands);

// POST /api/demands - Create new demand
router.post('/', demandsController.createDemand);

module.exports = router;
