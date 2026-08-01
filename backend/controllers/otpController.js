const Otp = require('../schemas/Otp.js')

const createAndSaveOtp = async (email, purpose = 'AUTH') => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await Otp.deleteMany({ email, purpose })

    await Otp.create({
        email,
        otp,
        purpose
    })

    return otp
}

const verifyAndConsumeOtp = async (email, otp, purpose = 'AUTH') => {
    const validOtp = await Otp.findOne({ email, otp, purpose })
    if (!validOtp) return false

    await Otp.deleteOne({ _id: validOtp._id })
    return true
}

const requestOtpEndpoint = async (req, res) => {
    const { email, purpose } = req.body
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' })
    }

    const otp = await createAndSaveOtp(email, purpose || 'AUTH')

    return res.status(200).json({ message: 'OTP sent successfully' })
}

const verifyOtpEndpoint = async (req, res) => {
    const { email, otp, purpose } = req.body
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' })
    }

    const isValid = await verifyAndConsumeOtp(email, otp, purpose || 'AUTH')
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    return res.status(200).json({ message: 'OTP verified successfully' })
}

module.exports = {
    createAndSaveOtp,
    verifyAndConsumeOtp,
    requestOtpEndpoint,
    verifyOtpEndpoint
}