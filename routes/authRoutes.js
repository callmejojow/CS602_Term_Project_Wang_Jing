const express = require('express');
const passport = require('passport');
const { signup, login, getProfile } = require('../controllers/authController');

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Route (Requires JWT)
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

module.exports = router;
