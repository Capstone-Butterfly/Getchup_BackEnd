const express = require('express');
const { login, createAccount } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/createAccount', createAccount)

module.exports = router;
