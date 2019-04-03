'use strict'

const express = require("express")
const router = express.Router()

const { User } = require('./models')
const { Course } = require('./models')

router.get("/users", (req, res, next) => {
  User.find({}, null, (err, users) => {
    if(err) return next(err);
    res.json(users);
  });
});

router.get("/courses", (req, res, next) => {
  Course.find({}, null, (err, courses) => {
    if(err) return next(err);
    res.json(courses);
  });
});



module.exports = router;