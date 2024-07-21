const express = require('express');
const { login, createAccount, editProfile, getUserById } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login' ,login);
router.post('/createAccount', createAccount)
router.put('/update/:userId', verifyToken, editProfile)
router.get('/getUserDetails/:userId', verifyToken, getUserById)

module.exports = router;