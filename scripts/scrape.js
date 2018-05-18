//Our scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

var scrape = function(cb){ 
        //first grab the body of the html with the request
        axios.get("http://www.relix.com/news/").then(function (response) {
            //then load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            var final_result = [];

            //now grab every div with a class of post
            $(".post").each(function (i, element) {


                // Add the text and href of every link, and save them as propreties of the result object
                var result = {}; // all the results
                try {

                    result.title = $(this)
                        .find("h2.headline a p")
                        .text()
                        .trim();
                    result.link = $(this)
                        .find("h2.headline a")
                        .attr("href");
                    result.summary = $(this)
                        .find(".newsBrowseBodies")
                        .text()
                        .trim();


                } catch (error) {
                    console.log("There is no scraping for this")
                }

                final_result.push(result);

            });
            cb(final_result); 
        });
          
}
module.exports= scrape;

