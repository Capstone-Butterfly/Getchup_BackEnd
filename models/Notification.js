const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    identifier: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task_id: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    sent_at: { type: Date },
    read: {type: Boolean, default: false}
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;