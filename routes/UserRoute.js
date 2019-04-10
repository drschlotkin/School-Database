'use strict'

//Global variables
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const {authenticateUser} = require('../Authentication/index');

// Model Schema
const { User } = require('../models/UserModel')


/* USER GET ROUTE
=================
Authenticate login and return current user information */

router.get('/users', authenticateUser, (req, res, next) => {
  let user = req.currentUser[0]
  res.json({
    "ID": user._id,
    "Name": `${user.firstName} ${user.lastName}`,
    "Email Address": user.emailAddress,
    "Password (hashed)": user.password
  });
});


/* USER POST ROUTE
=================
Create new user */

router.post('/users', (req, res, next) => {
  const newUser = req.body;
  if(newUser.password){
    User.find({emailAddress: newUser.emailAddress})
        .then(user => {
          if (user.length >= 1){
            return res.status(409).json({
              message: "Username already exists"
            });
          }else{
            const user = new User({
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              emailAddress: newUser.emailAddress,
              password: bcryptjs.hashSync(newUser.password)
            });
            user.save().then(() => {
              res.location('/');
              res.status(201).end();
            }).catch(err => {
              next(err);
            });
          };
        }).catch(err => {
          next(err);
    });
  }else{
    res.send(500, { error: "Missing field(s)" });
  };
});

module.exports = router;