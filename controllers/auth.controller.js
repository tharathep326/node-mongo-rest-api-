const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json(user.username);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    });

    return accessToken;
}


module.exports = {
    createUser,
    login
}