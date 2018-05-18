//import our scrape and date scripts 

var scrape = require("../scripts/scrape");
const date = require("../scripts/date");

//import the Article and Note models
var Article = require("../models/article");
var Note = require("../models/note");

module.exports = {
    fetch: function (cb) {
        scrape = (function (data) {
            let articles = data;

            for (let i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            Article.collection.insertMany(articles, {
                ordered: false
            }, function (err, docs) {
                cb(err, docs);
            })
        })
    },
    delete: function (query, cb) {
        Article.remove(query, cb);
    },
    get: function (query, cb) {
        Article.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },
    update: function (query, cb) {
        Article.update({
            _id: query._id
        }, {
            $set: query
        }, {}, cb);
    }
}