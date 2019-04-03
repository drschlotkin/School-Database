'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema

//Schema
const UserSchema = new Schema({
  firstName:{
    type: String,
    required:true
  },
  lastName:{
    type: String,
    required:true
  },
  emailAddress:{
    type: String,
    required:true
  },
  password:{
    type: String,
    required:true
  }
});

const CourseSchema = new Schema({
  firstName:{
    type: String,
    required:true
  },
  title:{
    type: String,
    required:true
  },
  description:{
    type: String,
    required:true
  },
  estimatedTime:{
    type: String,
  },
  materialsNeeded:{
    type: String
  }
});

const User = mongoose.model("User", UserSchema)
module.exports.User = User;

const Course = mongoose.model("Course", CourseSchema)
module.exports.Course = Course;

