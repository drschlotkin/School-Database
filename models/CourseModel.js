'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

//Course Schema
const CourseSchema = new Schema({
  title:{
    type: String,
    required: [true, 'You have to include a title']
  },
  description:{
    type: String,
    required: [true, 'You have to include a description']
  },
  estimatedTime:{
    type: String,
  },
  materialsNeeded:{
    type: String
  },
  user:{
    type: Schema.Types.ObjectId, ref: 'User'
  }
});

// Export for use in Routes.js
const Course = mongoose.model("Course", CourseSchema);
module.exports.Course = Course;