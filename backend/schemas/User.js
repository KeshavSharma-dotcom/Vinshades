const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const achievementSchema = new mongoose.Schema(
    {
        gamename: {
            type: String,
            required: true
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
)

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            minlength: [3, 'Username should contain at least 3 characters.'],
            maxlength: [8, 'Username cannot exceed 8 characters.'],
            required: true,
            index: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            index: true
        },
        password: {
            type: String,
            required: false,
            validate: {
                validator: function (value) {
                    if (!value) return true
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/.test(value)
                },
                message: 'Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 special character.'
            }
        },
        score: {
            type: Number,
            default: 0,
            index: true
        },
        avatar: {
            type: String,
            default: ''
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        otp: {
            type: String
        },
        otpExpiresAt: {
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        achievements: [achievementSchema]
    },
    { timestamps: true }
)

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return

    const saltRounds = parseInt(process.env.SALT, 10) || 10
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User