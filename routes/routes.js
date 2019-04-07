'use strict'

const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const auth = require('basic-auth')

// Model Schemas
const { User } = require('../models/UserModel')
const { Course } = require('../models/CourseModel')


// Authentication middleware function
const authenticateUser = (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials){
    User.find({emailAddress: credentials.name})
        .then(user => {
          if(user.length > 0){
            const authenticated = bcryptjs.compareSync(credentials.pass, user[0].password);
            if (authenticated) {
              console.log(`Authentication successful for username: ${user[0].firstName} ${user[0].lastName}`);
              req.currentUser = user;
              next();
            }else{
              message = `Authentication failure for username: ${user[0].firstName} ${user[0].lastName}`;
            }
          }else{
            message = `User not found for username: ${credentials.name}`;
          }
          if (message) {
            console.warn(message);
            res.status(401).json({ message: 'Incorrect username and/or password' });
          }
        })   
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
  }else{
    message = 'Auth header not found';
  }
};


// Authenticate login and return user information
router.get('/users', authenticateUser, (req, res, next) => {
  let user = req.currentUser[0]
  res.json({
    "ID": user._id,
    "Name": `${user.firstName} ${user.lastName}`,
    "Email Address": user.emailAddress,
    "Password *hashed*": user.password
  });
});


// Create user
router.post('/users', (req, res, next) => {
  const newUser = req.body
  User.find({emailAddress: newUser.emailAddress})
    .then(user => {
      if (user.length >= 1){
        return res.status(409).json({
          message: "Username already exists"
        })
      }else{
        const user = new User({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          emailAddress: newUser.emailAddress,
          password: bcryptjs.hashSync(newUser.password)
        });
        user.save().then(() => {
          res.location('/')
          res.status(201).end()
        }).catch(err => {
          next(err)
        })
      }
    }).catch(err => {
      next(err)
    })
});


// Get list of all courses
router.get('/courses', (req, res, next) => {
  Course.find()
    .populate('user', 'firstName lastName')
    .then((course) => {
      res.status(200).json(course)
    }).catch(err => {
      next(err)
    })
});


// Get course by ID
router.get('/courses/:id', (req, res, next) => {
  Course.findById(req.params.id)
    .populate('user', 'firstName lastName')
    .then((course) => {
      res.status(200).json(course)
    }).catch(err => {
      next(err)
    })
});



// Check for user authentication and create a course
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
    err.status = 400
    next(err)
  });
});


// Update a course
router.put('/courses/:id', authenticateUser, (req, res, next) => {
  const id = {_id : req.params.id} 
  const opts = { runValidators: true };
  Course.findById(req.params.id, (err, course) => {
    if(JSON.stringify(req.currentUser[0]._id) == JSON.stringify(course.user)){
      const course = {
        title: req.body.title,
        description: req.body.description
      }
      Course.findOneAndUpdate(id, course, opts)
        .exec()
        .then((course) => {
          res.status(204).json(course)
        }).catch(err => {
          next(err)
        })
    }else{
      res.status(403).json({
        error: 'You are not authorized to update this course.'
      });
    }
  })
})


// Delete course if it belongs to current user
router.delete('/courses/:id', authenticateUser, (req, res, next) => {
  const id = {_id : req.params.id};
  Course.findById(req.params.id, (err, course) => {
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
  });
});


module.exports = router;