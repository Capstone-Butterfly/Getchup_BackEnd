const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubtaskSchema = new Schema({
    sub_title: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    movement: {
      type: Boolean,
      default: false
    }
  }, { _id: false });  //Prevent creation of _id 

const CommonTaskSchema = new Schema({
      // common_task_id: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      // },
      category: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      subtask: [SubtaskSchema]
    });

const CommonTask = mongoose.model('CommonTask', CommonTaskSchema);

module.exports = CommonTask;