const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoutes')
const otpRoutes = require('./otpRoutes')
const userRoutes = require('./userRoutes')

router.use('/auth', authRoutes)
router.use('/otp', otpRoutes)
router.use('/users', userRoutes)

module.exports = router