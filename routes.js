'use strict'

const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const auth = require('basic-auth')

const { User } = require('./models/UserModel')
const { Course } = require('./models/CourseModel')


// Authentication function
const authenticateUser = (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials){
    User.find({emailAddress: credentials.name})
        .exec()
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
            res.status(401).json({ message: 'Access Denied' });
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



// Return users
router.get('/users', authenticateUser, (req, res, next) => {
  res.json(req.currentUser)
  res.json({
    name: user.name,
    username: user.username,
  });
  // User.find({}, null, (err, users) => {
  //   if(err) return next(err);
  //   res.status(200).json(users);
  // });
});


// Create user
router.post('/users', (req, res, next) => {
  const user = new User(req.body)
  User.create(user, (err, user) => {
    if(err) return next(err)
    res.status(201).json(user)
  })
});


// Get courses
router.get('/courses', (req, res, next) => {
  Course.find({}, null, (err, courses) => {
    if(err) return next(err);
    res.status(200).json(courses);
  });
});


// Get course by ID
router.get('/courses/:id', (req, res, next) => {
  Course.findById(req.params.id, (err, course) => {
    if(err) return next(err);
    res.status(200).json(course);
  });
});


// Create a course
router.post('/courses', (req, res, next) => {
  const course = new Course(req.body)
  Course.create(course, (err, course) => {
    if(err) return next(course)
    res.status(201).json(course)
  })
});


// Delete a course
router.delete('/courses/:id', (req, res, next) => {
  const id = {_id : req.params.id}  
  Course.remove(id, (err, course) => {
    if(err)return next(course)
    res.status(204).json(course)
  })
})


// Update a course
router.put('/courses/:id', (req, res, next) => {
  const id = {_id : req.params.id} 
  const course = {
    title: req.body.title,
    description: req.body.description
  }
  Course.findOneAndUpdate(id, course, {}, (err, course) => {
    if(err) return next(course)
    res.status(204).json(course)
  })
})


// other guy
// router.patch("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       console.log(result);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });





module.exports = router;