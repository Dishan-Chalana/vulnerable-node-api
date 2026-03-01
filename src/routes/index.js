const express = require('express');
const router = express.Router();
const controller = require('../controller');

// Auth
router.post('/login', controller.login);
router.post('/register', controller.register);

// Users
router.get('/users', controller.verifyToken, controller.getAllUsers);
router.get('/users/:id', controller.verifyToken, controller.getUser);

// Products
router.get('/products', (req, res) => {
    const service = require('../service');
    const results = service.searchProducts(req.query.q || '');
    return res.json(results);
});

// Admin (no auth middleware)
router.get('/admin/dashboard', controller.adminDashboard);

// Utilities
router.post('/ping', controller.ping);
router.get('/file', controller.getFile);

module.exports = router;
