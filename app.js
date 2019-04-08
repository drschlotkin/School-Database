'use strict';

const express = require('express');
const morgan = require('morgan');
const routes = require("./routes/routes");
const mongoose = require("mongoose");
const jsonParser = require("body-parser").json;

// create the Express app
const app = express();

// setup morgan for HTTP request logging
app.use(morgan('dev'));

// JSON parser to manage HTTP request
app.use(jsonParser());

// Connect to Mongoose
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi");
const db = mongoose.connection;

// Error handler for database
db.on("error", err => {
  console.error("Connection error:", err)
});

// Listen for database connection
db.once("open", () => {
  console.log('db connection successful')
});

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// TODO setup your api routes here
app.use("/api", routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my school database REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
