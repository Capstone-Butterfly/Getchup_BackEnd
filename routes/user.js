const express = require('express');
const { login, createAccount, editProfile, getUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/login' ,login);
router.post('/createAccount', createAccount)
router.put('/update/:userId', editProfile)
router.get('/getUserDetails/:userId', getUserById)
module.exports = router;