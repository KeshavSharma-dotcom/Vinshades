const express = require('express')
const router = express.Router()

const { googleAuth, loginOrRegisterWithOtp, logout } = require('../controllers/authController')
const { authLimiter } = require('../middlewares/rateLimiter')

router.post('/google', authLimiter, googleAuth)
router.post('/otp-login', authLimiter, loginOrRegisterWithOtp)
router.post('/logout', logout)

module.exports = router