const mongoose = require("mongoose");

const lifeSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Life = mongoose.model("Life", lifeSchema);

module.exports = Life;