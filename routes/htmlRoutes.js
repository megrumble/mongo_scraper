// INCLUDES
const request = require('request');
const BASEURL = require('base-url');


module.exports = (app) => {
    
    // GET '/'
    app.get('/', (req, res) => {
        res.render('index');
    });

    // GET '/scrape'
    app.get('/scrape', (req, res) => {
        // res.render("articles");
        let baseUrl = req.headers.referer;
        request.get(baseUrl + "/api/scrape", (err, response) => {
            if(err) throw err;
            let articles = JSON.parse(response.body);
            res.render('articles', {layout: false, articles: articles });
        })
    })
    }