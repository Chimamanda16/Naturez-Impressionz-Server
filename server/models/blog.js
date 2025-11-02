const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;