const Notification = require('../models/Notification');

const saveNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        const result = await notification.save();
        const urlStr = `/api/v1/notifications/${result.id}`;
    console.log("saving")
    // Set content-location header
    res.set("content-location", urlStr);
    res.status(201).json({ url: urlStr, data: result });
  } catch (error) {
      console.log("not saving")
        res.status(500).json({ message: 'Error saving notification' });
    }
};

const getNotificationsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      const notifications = await Notification.find({ user_id: userId }).exec();
      if (notifications.length === 0) {
        res.status(404).json({ message: "No notifications found for this user." });
      } else {
        res.status(200).json(notifications);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

module.exports = { saveNotification, getNotificationsByUser };
