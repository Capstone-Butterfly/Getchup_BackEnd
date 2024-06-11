const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subtaskSchema = new Schema({
    sub_title: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    start_time: {
      type: Date
    },
    pause_time: {
      type: Date
    },
    end_time: {
      type: Date
    },
    movement: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['new', 'progress', 'pause', 'complete'],
      default: 'new'
    }
  }, { _id: false });  // Set _id to false to prevent creation of _id for each subtask

const TaskSchema = new Schema({
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // Reference to the User model
      },
      title: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        default: ''
      },
      created_datetime: {
        type: Date,
        default: Date.now
      },
      start_date: {
        type: Date
      },
      completed_date: {
        type: Date
      },
      subtask: [subtaskSchema],
      user_estimate_duration: {
        type: Number  
      },
      start_time: {
        type: Number  
      },
      end_time: {
        type: Number  
      },
      actual_duration: {
        type: Number  
      },
      task_urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;