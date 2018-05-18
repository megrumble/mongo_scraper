$(document).ready(function () {
  //set reference to article-container div where all dynamically generated articles will go
  //add event listeners for scrape and add buttons
  const articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);


//once document is ready, run initPage function
initPage();

function initpage() {
  //empty articleContainer, run ajax request for any unsaved articles
  articleContainer.empty();
  $.get("/api/articles?saved=false")
    .then(function (data) {
      //if articles, render them
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
}

function renderArticles(articles) {
  const articlePanels = [];

  for (let i = 0; i < articles.length; i++) {
    articlePanels.push(createPanel(articles[i]));
  }
  articleContainer.append(articlePanels);
}

function createPanel(article) {
  //takes in a json object for the article then constructs a jquery element containing all of the html
  const panel =
    $(["<div class='panel panel-default'>",
      "<div class='panel-heading'>",
      "<h3>",
      article.title,
      "<a class='btn btn-success save'>",
      "Save Article",
      "</a>",
      "</h3>",
      "</div>",
      "<div class='panel-body'>",
      "<a href='article.link' target='_blank'>",
      "</a>",
      "<p>",
      article.summary,
      "</p>",
      "</div>",
    ].join(""));

  panel.data("_id", article.id);
  return panel;
}

function renderEmpty() {
  const emptyAlert =
    $(["<div class= 'alert alert-warning text-center>",
      "<h4>There are no new articles</h4>",
      "</div>",
      "<div class='panel panel-default'>",
      "<div class='panel-heading text-center>",
      "<h3>What would you like to do?</h3>",
      "</div>",
      "<div class ='panel-body text-center'>",
      "<h4><a class ='scrape-new'>Scrape New Articles?</a></h4>",
      "<h4><a href='/saved'>Go to Saved Articles?</a></h4>",
      "</div>",
      "</div>"
    ].join(""));

  articleContainer.append(emptyAlert);
}


function handleArticleSave() {
  //this function is triggered by the save button. 
  //when we rendered the article initially we attached a javascript object using the headline id
  //to the element using the .data method. here we retrieve that
  let articleToSave = $(this).parents(".panel").data();
  articleToSave.saved = true;
  //use the patch method to update
  $.ajax({
      method: "PATCH",
      url: "/api/articles",
      data: articleToSave
    })
    .then(function (data) {
      //if successful mongoose will send back an object containing a key of "ok" with the value of 1
      if (data.ok) {
        //running initPage will reload articles
        initPage();
      }
    })
}

function handleArticleScrape(){
  $.get("/api/fetch")
  .then(function(data){
    initPage();
    bootbox.alert("<h3 class='text-center' m-top-80>" * data.message * "</h3>");
  });
}
});
