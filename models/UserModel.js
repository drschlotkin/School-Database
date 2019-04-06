'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema

//User Schema
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
    required:true,
    unique: true,
    lowercase: true
  },
  password:{
    type: String,
    required:true
  }
});

// Export for use in Routes.js
const User = mongoose.model("User", UserSchema)
module.exports.User = User;