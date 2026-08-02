const express = require('express')
const router = express.Router()

const { googleAuth, loginOrRegisterWithOtp, logout } = require('../controllers/authController')
const { requestOtpEndpoint, verifyOtpEndpoint } = require('../controllers/otpController')
const { getMyProfile, getLeaderboard, getPlayerProfile } = require('../controllers/userController')
const { authenticateToken } = require('../middlewares/authMiddleware')

// Standalone OTP Routes
router.post('/otp/request', requestOtpEndpoint)
router.post('/otp/verify', verifyOtpEndpoint)

// Auth Routes
router.post('/auth/google', googleAuth)
router.post('/auth/otp-login', loginOrRegisterWithOtp)
router.post('/auth/logout', logout)

// User Profile & Leaderboard Routes
router.get('/users/me', authenticateToken, getMyProfile)
router.get('/leaderboard', authenticateToken, getLeaderboard)
router.get('/users/player/:id', authenticateToken, getPlayerProfile)

module.exports = router