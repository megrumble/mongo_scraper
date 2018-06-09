const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs  = require('express-handlebars');
const path = require("path");



//Require models
// var db = require("./models");

const PORT = process.env.PORT || 3000;

//initialize express
const app = express();
//Set up express router
const router = express.Router();

// Configure Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Configure middleware
app.use(router);
//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use express.static to server the public folder as a static directory
app.use(express.static(__dirname +"/public"));


//Set mongoose to leverage built-in Javascript ES6 promises
//Connect to the Mongo DB

mongoose.Promise = Promise;

// Database configuration with mongoose
var databaseUri = "mongodb://localhost:27017/relix-scraper";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true});
} else {
  mongoose.connect(databaseUri, { useMongoClient: true});
}
// mongoose.connect("mongodb://heroku_xxkr78kt:bmo54c3q0c31m1u2fc0ldn2io4@ds225038.mlab.com:25038/heroku_xxkr78kt", {
//   useMongoClient: true
// });
// mongoose.connect("mongodb://localhost:27017/relix-scraper", {
//   useMongoClient: true
// });
// Routes
require('./config/routes')(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});