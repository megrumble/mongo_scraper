const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
let NoteSchema = new Schema({
  // `title` is of type String
    _articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article",
  },
    date:{
      type: String
    },
    noteText:{
      type:String
    }
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
