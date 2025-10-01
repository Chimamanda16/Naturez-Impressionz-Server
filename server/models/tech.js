import mongoose from "mongoose";

const techSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Tech = mongoose.model("Tech", techSchema);

export default Tech;