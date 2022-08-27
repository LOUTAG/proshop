const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {register, login, profile, updateProfile, refreshAccessToken } = require('../controllers/userController');

// @desc Register an user
// @route POST /api/users/register
// @access Public
router.post('/register', register);

// @desc Login an user
// @route POST /api/users/login
// @access Public
router.post('/login', login);

// @desc user Profile
// @route GET /api/users/profile
// @access Private
router.get('/profile', authMiddleware, profile);

// @desc Update user Profile
// @route POST /api/users/profile
// @access Private
router.post('/profile', authMiddleware, updateProfile);

// @desc refresh access token
// @route GET /api/users/refresh-token
// @access Public
router.get('/refresh-access-token', refreshAccessToken);

module.exports = router;