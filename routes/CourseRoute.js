'use strict'

//Global variables
const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../Authentication/');

// Model Schema
const { Course } = require('../models/CourseModel');


/* COURSE GET ROUTE
===================
Retrieve list of all currently registered courses */

router.get('/courses', (req, res, next) => {
  Course.find()
    .populate('user', 'firstName lastName')
    .then((course) => {
      res.status(200).json(course);
    }).catch(err => {
      next(err);
    });
});


/* COURSE GET ROUTE
===================
Retrieve course by ID */

router.get('/courses/:id', (req, res, next) => {
  Course.findById(req.params.id)
    .populate('user', 'firstName lastName')
    .then((course) => {
      res.status(200).json(course);
    }).catch(err => {
      next(err);
    });
});


/* COURSE POST ROUTE
====================
Create a new course */

router.post('/courses', authenticateUser, (req, res, next) => {
  const newCourse = req.body;
  const course = new Course({
    title : newCourse.title,
    description : newCourse.description,
    estimatedTime : newCourse.estimatedTime,
    materialsNeeded : newCourse.materialsNeeded,
    user : req.currentUser[0]
  });
  course.save().then((course) => {
    res.location(`/courses/${course.id}`);
    res.status(201).end();
  }).catch(err => {
    err.status = 400;
    next(err);
  });
});


/* COURSE PUT ROUTE
===================
Update a course by ID if registered to current user*/

router.put('/courses/:id', authenticateUser, (req, res, next) => {
  const id = {_id : req.params.id} 
  const opts = { runValidators: true };
  Course.findById(req.params.id)
    .then(course => {
      if(JSON.stringify(req.currentUser[0]._id) == JSON.stringify(course.user)){
        if(req.body.title && req.body.description){
          Course.findOneAndUpdate(id, req.body, opts)
            .exec()
            .then((course) => {
              res.status(204).json(course);
            }).catch(err => {
              next(err);
          });
        }else{
          res.status(400).json({
            error: 'Title AND Description are required.'
          });
        }
      }else{
        res.status(403).json({
          error: 'You are not authorized to update this course.'
        });
      };
    }).catch(err => {
      err.status = 404;
      next(err);
    });   
});


/* COURSE DELETE ROUTE
===================
Delete course if registered to current user */

router.delete('/courses/:id', authenticateUser, (req, res, next) => {
  const id = {_id : req.params.id};
  Course.findById(req.params.id)
    .then((course) => {
      if(JSON.stringify(req.currentUser[0]._id) == JSON.stringify(course.user)){
        Course.remove(id, (err, course) => {
          if(err) return next(course);
          res.status(204).json(course);
        })
      }else{
        res.status(403).json({
          error: 'You are not authorized to delete this course.'
        });
      };
    }).catch(err => {
      err.status = 404;
      next(err);
    }) 
});

module.exports = router;