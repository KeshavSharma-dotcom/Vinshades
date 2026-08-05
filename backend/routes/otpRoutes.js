const express = require('express')
const router = express.Router()

const { requestOtpEndpoint, verifyOtpEndpoint } = require('../controllers/otpController')
const { otpLimiter } = require('../middlewares/rateLimiter')

router.post('/request', otpLimiter, requestOtpEndpoint)
router.post('/verify', otpLimiter, verifyOtpEndpoint)

module.exports = router