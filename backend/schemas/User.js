const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: [true],
        unique: true,
        minlength: [3, 'User name should contain atleast 3 characters.'],
        maxlength: [8, 'Username cannot exceed 8 characters.'],
        required: true
    },
    email: {
        type: String,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        required: true
    },
    password: {
        type: String,
        trim: false,
        minlength: [6, 'password should contain atleast 6 characters.'],
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/.test(value);
            },
            message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character.',
        },
    },
    isVerified: {
        type: Boolean,

    },

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(process.env.SALT)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User