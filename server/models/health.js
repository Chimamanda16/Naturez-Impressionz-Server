const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Health = mongoose.model("Health", healthSchema);

module.exports = Health;