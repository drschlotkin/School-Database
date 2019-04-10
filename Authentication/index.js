'use strict'

//Global variables
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { User } = require('../models/UserModel');

// Authentication middleware
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

module.exports.authenticateUser = authenticateUser;