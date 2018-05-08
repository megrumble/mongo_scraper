const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs  = require('express-handlebars');
const path = require("path");

//Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");




//Require models
// var db = require("./models");

const PORT = process.env.PORT || 3000;

//initialize express
const app = express();




// views
  // layouts
    // file_name

// Configure Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//Use express.static to server the public folder as a static directory
app.use(express.static("public"));


//Set mongoose to leverage built-in Javascript ES6 promises
//Connect to the Mongo DB

mongoose.Promise = Promise;
// mongoose.connect("mongodb://heroku_xxkr78kt:bmo54c3q0c31m1u2fc0ldn2io4@ds225038.mlab.com:25038/heroku_xxkr78kt", {
//   useMongoClient: true
// });
mongoose.connect("mongodb://localhost:27017/relix-scraper", {
  useMongoClient: true
});
// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);
// app.get("/", function(req, res) {

//   db.Article
//     .find({})
//     .populate("note")
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       console.log("Articles: ", dbArticle);
//       res.render("index", { data: dbArticle });
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });

  
// });

// //Get route for scraping the relix website
// app.get("/scrape", function (req, res) {

//   // Debugging 
//   //first grab the body of the html with the request
//   axios.get("http://www.relix.com/news/").then(function (response) {
//     //then load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);
//     var final_results = []; 

//     //now grab every div with a class of post
//     $(".post").each(function (i, element) {


//       // console.log("Image: ", $(this).find(".newsBrowseBodies").text());;
//       // Add the text and href of every link, and save them as propreties of the result object
//       var result = {}; // all the results
//       try {
       
//         result.title = $(this)
//           .find("h2.headline a p")
//           .text();
//         result.link = $(this)
//           .find("h2.headline a")
//           .attr("href");
//         result.summary = $(this)
//           .find(".newsBrowseBodies")
//           .text();
        
          
//       } catch (error) {
//         console.log("There is no scraping for this")
//       }

//       console.log("Results: ", result);

//       final_results.push(result);
//       // console.log("Result: ", result);    

//     });

//     //Create a new Article using the `result` object built from scraping
//     db.Article
//       .create(final_results)
//       .then(function (dbArticle) {
//         // If we were able to successfully scrape and save an Article, send a message to the client
//         res.redirect("/");
//       })
//       .catch(function (err) {
//         //if an error occurred, send it to the client
//         res.json(err);
//       });
//   });
// });

// // Route for getting all Articles from the db
// app.get("/articles", function (req, res) {
//   // Grab every document in the Articles collection
//   db.Article
//     .find({})
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function (req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...

//   console.log("Body: ", req.params.id);
//   db.Article
//     .findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function (dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function (req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note
//     .create(req.body)
//     .then(function (dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function (dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});