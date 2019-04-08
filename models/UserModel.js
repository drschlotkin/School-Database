'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password:{
    type: String,
    required:true
  }
});

// Export for use in Routes.js
const User = mongoose.model("User", UserSchema);
module.exports.User = User;