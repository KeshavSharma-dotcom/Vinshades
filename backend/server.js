require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const routes = require('./routes/routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
)

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' }
})

app.use(globalLimiter)

app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'OK', timestamp: new Date() })
})

app.use('/api', routes)

app.use((req, res) => {
    return res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    return res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.')
    process.exit(1)
}

let server

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB')
        server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err)
        process.exit(1)
    })

const shutdown = () => {
    console.log('Received shutdown signal. Closing server...')
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed.')
            await mongoose.connection.close()
            console.log('MongoDB connection closed.')
            process.exit(0)
        })
    } else {
        process.exit(0)
    }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)