var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db = require("./models");

var PORT =3000;

//initialize express
var app = express();

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: false}));
//Use express.static to server the public folder as a static directory
app.use(express.static("public"));

//Set mongoose to leverage built-in Javascript ES6 promises
//Connect to the Mongo DB

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/relixPopulator", {
    useMongoClient: true
});

// Routes

//Get route for scraping the relix website
app.get("scrape", function(req, res){
    //first grab the body of the html with the request
    axios.get("http.//www.relix.com/news/").then(function(response){
        //then load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        //now grab every h2 with a class of headline
        $("h2.headline").each(function(i, element){
            var result = {};
            // Add the text and href of every link, and save them as propreties of the result object
            result.title = $(this)
                .children("p")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            //Create a new Article using the `result` object built from scraping
            db.Article
                .create(result)
                .then(function(dbArticle){
                    // If we were able to successfully scrape and save an Article, send a message to the client
                    res.send("Scrape Complete");
                })
                .catch(function(err){
                    //if an error occurred, send it to the client
                    res.json(err);
                });
        });
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });