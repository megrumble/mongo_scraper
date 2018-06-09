$(document).ready(function () {

  //add event listeners for scrape, save, and delete buttons

  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(document).on("click", ".btn.delete", handleArticleDelete);


function handleArticleSave() {
  //this function is triggered by the save button. 
  //when we rendered the article initially we attached a javascript object using the headline id
  //to the element using the .data method. here we retrieve that
  let articleToSave = $(this).parents(".panel").data();
  const id = $(this).attr("data-id");

  articleToSave.saved = true;
  articleToSave._id = id;
  console.log("id: ", id);
  console.log("Data: ", articleToSave);
  //use the post method to update
  $.ajax({
      method: "POST",
      url: "/api/articles",
      data: articleToSave
    })
    .then(function (data) {
      //if successful mongoose will send back an object containing a key of "ok" with the value of 1
      if (data.ok) {
        location.reload();
        //running initPage will reload articles
        // initPage();
      }
    })
}

function handleArticleScrape(){
  $.get("/api/fetch")
  .then(function(data){
  $(".articles").remove();
  $.get("/").then( function(){
    // bootbox.alert("<h3 class='text-center' m-top-80>" * data.message * "</h3>", function(result){
      location.reload();
    // });
  })
  
   
  });
}

function handleArticleDelete(){
  let articleToDelete = $(this).parents(".panel").data();
  const id = $(this).attr("data-id");
  articleToDelete.saved = false;
  articleToDelete._id = id;
    
    $.ajax({
        method: "POST",
        url: "/api/articles/",
        data: articleToDelete
    }).then(function(data) {
        location.reload();
    });
  }
});

$('.saved-buttons').on('click',  function () {
  // the NEWS article id
  var thisId = $(this).attr("data-value");

  //attach news article _id to the save button in the modal for use in save post
  $("#saveNote").attr({"data-value": thisId});

  //make an ajax call for the notes attached to this article
  $.get("/notes/" + thisId, function(data){
      console.log(data);
      //empty modal title, textarea and notes
      $('#noteModalLabel').empty();
      $('#notesBody').empty();
      $('#notestext').val('');

      //delete button for individual note

      //add id of the current NEWS article to modal label
      $('#noteModalLabel').append(' ' + thisId);
      //add notes to body of modal, will loop through if multiple notes
      for(var i = 0; i<data.note.length; i++) {
          var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
          $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].body + '  ' + button + '</div></div>');
      }
  });
});

$(".saveNote").click(function() {
  // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-value");


  // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId,
      data: {
        // Value taken from title input

        // Value taken from note textarea
        body: $("#notestext").val().trim()
      }
    })
      // With that done
    .done(function(data) {
        // Log the response
        //console.log(data);
        $('#noteModal').modal('hide');

    });
  });


