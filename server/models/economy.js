import mongoose from "mongoose";

const econSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Economy = mongoose.model("Economy", econSchema);

export default Economy;