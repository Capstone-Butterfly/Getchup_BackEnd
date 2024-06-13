const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationDetailSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: String, required: true },
  long: { type: String, required: true }
});

const ProfileSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location_detail: { type: [LocationDetailSchema], default: [] },
  music: { type: Array, default: [] },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  user_type: { type: Number, enum: [1, 2, 3] },
  task_reminder: { type: Boolean, default: false },
  movement_reminder: { type: Boolean, default: false },
  notification: { type: Boolean, default: true },
});

module.exports = mongoose.model('Profile', ProfileSchema);
