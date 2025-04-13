
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET /api/products - Get all products
router.get('/', productsController.getProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', productsController.getProductById);

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', productsController.getProductsByCategory);

// POST /api/products - Create new product
router.post('/', productsController.createProduct);

module.exports = router;
