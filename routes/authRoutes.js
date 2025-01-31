const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/signup', signup);
router.post('/login', login);

// Protected Route (Requires JWT)
router.get('/profile', isAuthenticated, getProfile);

module.exports = router;
