
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET /api/categories - Get all categories
router.get('/', categoriesController.getCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;
