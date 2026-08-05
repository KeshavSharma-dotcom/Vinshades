const User = require('../schemas/User.js')
const { verifyAndConsumeOtp } = require('./otpController')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m'
    })
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    })
    return { accessToken, refreshToken }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const googleAuth = async (req, res) => {
    const { idToken } = req.body
    if (!idToken) {
        return res.status(400).json({ message: 'Google ID token is required' })
    }

    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    const { email, name, picture, sub: googleId } = payload

    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (!user) {
        const generatedUsername = name ? name.replace(/\s+/g, '').substring(0, 8) : 'user' + Math.floor(100 + Math.random() * 900)

        user = await User.create({
            email,
            name: generatedUsername,
            avatar: picture,
            googleId,
            isVerified: true
        })
    } else if (!user.googleId) {
        user.googleId = googleId
        user.isVerified = true
        await user.save()
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, cookieOptions)
    return res.status(200).json({
        message: 'Authentication successful',
        accessToken,
        user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }
    })
}

const loginOrRegisterWithOtp = async (req, res) => {
    const { email, otp, name } = req.body
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' })
    }

    const isValid = await verifyAndConsumeOtp(email, otp, 'AUTH')
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    let user = await User.findOne({ email })

    if (!user) {
        const fallbackName = name || 'user' + Math.floor(100 + Math.random() * 900)
        user = await User.create({
            email,
            name: fallbackName,
            isVerified: true
        })
    } else if (!user.isVerified) {
        user.isVerified = true
        await user.save()
    }

    const { accessToken, refreshToken } = generateTokens(user._id)

    res.cookie('refreshToken', refreshToken, cookieOptions)
    return res.status(200).json({
        message: 'Authentication successful',
        accessToken,
        user: { id: user._id, email: user.email, name: user.name }
    })
}

const logout = async (req, res) => {
    res.clearCookie('refreshToken', cookieOptions)
    return res.status(200).json({ message: 'Logged out successfully' })
}

module.exports = { googleAuth, loginOrRegisterWithOtp, logout }