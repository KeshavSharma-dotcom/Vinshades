const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['AUTH', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'SENSITIVE_ACTION'],
        default: 'AUTH'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})

module.exports = mongoose.model('Otp', otpSchema)