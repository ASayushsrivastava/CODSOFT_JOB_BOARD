const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile } = require('../Controllers/authController');
const { isAuthenticated } = require('../Middleware/auth');

// signup
router.post('/signup', signup);

// signin
router.post('/signin', signin);

// logout
router.get('/logout', logout);

// me
router.get('/me', isAuthenticated, userProfile);

module.exports = router;