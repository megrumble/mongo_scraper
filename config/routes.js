const scrape = require("../scripts/scrape");

const articlesController = require("../controllers/articles");
const notesController = require("../controllers/notes");

module.exports = function(router) {
  //route to render home
  router.get("/", (req, res) => {
    let query = {};
    if (req.query.saved) {
      query = req.query;
    }

    articlesController.get(query, data => {
      res.render("home", { articles: data });
      // res.json(data);
    });
  });
  //route to render saved page
  router.get("/saved", (req, res) => {
    res.render("saved");
  });
  router.get("/api/fetch", (req, res) => {
    articlesController.fetch(function(err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "There are no new articles to scrape"
        });
      } else {
        res.json({
          message: "There are " + docs.insertedCount + " new articles!"
        });
      }
    });
  });
  router.get("/api/articles", (req, res) => {
    let query = {};
    if (req.query.saved) {
      query = req.query;
    }
    articlesController.get(query, data => {
      res.json(data);
    });
  });
  router.delete("/api/articles/:id", (req, res) => {
    console.log("Delete: ", req.body);
      
    let query = {};
    query._id = req.params.id;
    articlesController.delete(query, (err, data) => {
      res.json(data);
    });
  });
  router.post("/api/articles", (req, res) => {
    console.log("Data: ", req.body);
    articlesController.update(req.body, (err, data) => {
      res.json(data);
    });
  });
  router.get("/api/notes/:article_id?", (req, res) => {
    let query = {};
    if (req.params.article_id) {
      query._id = req.params.article_id;
    }
    notesController.get(query, (err, data) => {
      res.json(data);
    });
  });
  router.delete("/api/notes/:id", (req, res) => {
    let query = {};
    query._id = req.params.id;
    notesController.delete(query, (err, data) => {
      res.json(data);
    });
  });
  router.post("/api/notes", (req, res) => {
    notesController.save(req.body, data => {
      res.json(data);
    });
  });
};
