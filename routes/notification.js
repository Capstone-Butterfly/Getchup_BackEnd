const express = require('express');
const router = express.Router({mergeParams:true});

const notificationCtrl = require('../controllers/notificationController');

// Route to save a notification
router.post('/notifications', notificationCtrl.saveNotification);

module.exports = router;
