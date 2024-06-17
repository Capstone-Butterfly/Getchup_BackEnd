const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionDetailSchema = new Schema({
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      enum: ['Almost Always', 'Frequently', 'Occationally', 'Rarely'],
      required: true
    }
}, { _id: false });  
  
const surveySchema = new Schema({
    question_1: [questionDetailSchema],
    question_2: [questionDetailSchema],
    question_3: [questionDetailSchema],
    question_4: [questionDetailSchema]
});
  
  const Survey = mongoose.model('Survey', surveySchema);
  
  module.exports = Survey;