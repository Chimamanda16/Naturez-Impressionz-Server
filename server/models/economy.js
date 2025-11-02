const mongoose = require("mongoose");

const econSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Economy = mongoose.model("Economy", econSchema);

module.exports = Economy;