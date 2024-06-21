const express = require('express');
const router = express.Router();
const { scheduleNotifications } = require('../controllers/notificationController');

router.post('/push/schedule', async (req, res) => { //endpoint for scheduling notifications in the backend
    try {
        await scheduleNotifications();
        res.status(200).send('Notifications scheduled successfully');
    } catch (error) {
        res.status(500).send('Error scheduling notifications');
    }
});

module.exports = router;
