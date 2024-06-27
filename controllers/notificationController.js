const Notification = require('../models/Notification');
const axios = require('axios');

// Function to save a notification to the database
const saveNotification = async (req, res) => {
    try {
        const { identifier, user_id, task_id, message, sent_at } = req.body;

        const newNotification = new Notification({
            identifier,
            user_id,
            task_id,
            message,
            sent_at,
            read: false
        });

        const savedNotification = await newNotification.save();

        res.status(201).json({ message: 'Notification saved successfully', notification: savedNotification });
    } catch (error) {
        res.status(500).json({ message: 'Error saving notification' });
    }
};

module.exports = {
    saveNotification
};
