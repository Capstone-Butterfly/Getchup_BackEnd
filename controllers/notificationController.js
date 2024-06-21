const Notification = require('../models/Notification');
const Task = require('../models/Task');
const User = require('../models/User');
const axios = require('axios');

const sendNotification = async (userId, message) => {
    const user = await User.findById(userId);
    if (user && user.pushToken) {
        await axios.post('https://exp.host/--/api/v2/push/send', { // endpoint to send push notifications via the Expo API
            to: user.pushToken,
            sound: 'default',
            body: message,
        });
    }
};

const scheduleNotifications = async () => {
    const now = new Date();
    const allTasks = await Task.find().populate('user_id');
    const tasks = allTasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return dueDate >= now && dueDate <= new Date(now.getTime() + 45 * 60 * 1000) && ['new'].includes(task.status);
    });

    for (const task of tasks) {
        const existingNotification = await Notification.findOne({ task_id: task._id });
        if (!existingNotification) {
            const notification = new Notification({
                user_id: task.user_id._id,
                task_id: task._id,
                message: `Task "${task.title}" is due soon!`,
                sent_at: now,
                read: false
            });

            await notification.save();
            await sendNotification(task.user_id._id, notification.message);
        }
    }
};

module.exports = {
    scheduleNotifications,
    sendNotification
};
