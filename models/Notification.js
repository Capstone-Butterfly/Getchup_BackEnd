Notification.js (models)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    message: { type: String, required: true },
    sent_at: { type: Date, required: true },
    read: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('Notification', NotificationSchema);