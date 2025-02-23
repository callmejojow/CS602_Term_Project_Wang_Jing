const express = require('express');
const { signup, login, getProfile, logout, checkAuth, register, getAllUsers, updateUserRole, deleteUser } = require('../controllers/authController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/signup', signup);
router.post('/login', login);

// Protected Route (Requires JWT)
router.get('/profile', isAuthenticated, getProfile);

router.post('/logout', isAuthenticated, logout);

router.get('/check', isAuthenticated, checkAuth);

// New admin routes
router.get('/allUsers', [isAuthenticated, isAdmin], getAllUsers);
router.patch('/:id/role', [isAuthenticated, isAdmin], updateUserRole);
router.delete('/:id', [isAuthenticated, isAdmin], deleteUser);

module.exports = router;
