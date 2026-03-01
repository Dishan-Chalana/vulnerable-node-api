const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const service = require('../service');

// Auth

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = service.loginUser(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        service.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '24h' }
    );

    res.cookie('session_token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
    });

    return res.json({ message: 'Login successful', token, user });
};

exports.register = (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = service.createUser(username, email, password, role);
        return res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        return res.status(500).json({ error: 'Registration failed' });
    }
};

// Users

exports.getUser = (req, res) => {
    const user = service.findUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
};

exports.getAllUsers = (req, res) => {
    const users = service.getAllUsers();
    return res.json(users);
};

// Admin

exports.adminDashboard = (req, res) => {
    const users = service.getAllUsers();
    return res.json({
        dashboard: {
            totalUsers: users.length,
            admins: users.filter(u => u.role === 'admin').length,
        },
    });
};

// Utilities

exports.ping = (req, res) => {
    const { host } = req.body;
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        return res.json({ output: stdout });
    });
};

exports.getFile = (req, res) => {
    const filePath = req.query.file;
    if (!filePath) {
        return res.status(400).json({ error: 'file parameter required' });
    }
    const fullPath = path.join(__dirname, '..', '..', 'uploads', filePath);
    fs.readFile(fullPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message, stack: err.stack });
        }
        return res.json({ content: data });
    });
};

// Middleware

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, service.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
