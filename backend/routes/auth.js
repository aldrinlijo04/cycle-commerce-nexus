
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// POST /api/auth/register - Register user
router.post('/register', authController.register);

module.exports = router;
