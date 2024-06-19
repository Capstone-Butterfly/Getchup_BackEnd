const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  music: { type: Array, default: [] },
  phone: { type: String, required: true },
  user_type: { type: Number, enum: [1, 2, 3] },
  task_reminder: { type: Boolean, default: false },
  movement_reminder: { type: Boolean, default: false },
  notification: { type: Boolean, default: true },
});

module.exports = mongoose.model('Profile', ProfileSchema);
