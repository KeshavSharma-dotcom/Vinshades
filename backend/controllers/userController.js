const User = require('../schemas/User.js')

const getMyProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
}

const getLeaderboard = async (req, res) => {
    const leaderboard = await User.find()
        .sort({ score: -1 })
        .limit(50)
        .select('name avatar score achievements')

    return res.status(200).json(leaderboard)
}

const getPlayerProfile = async (req, res) => {
    const { id } = req.params
    const player = await User.findById(id).select('name avatar score achievements createdAt')

    if (!player) {
        return res.status(404).json({ message: 'Player not found' })
    }

    return res.status(200).json(player)
}

module.exports = { getMyProfile, getLeaderboard, getPlayerProfile }