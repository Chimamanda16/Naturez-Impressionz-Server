import mongoose from "mongoose";

const edSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Education = mongoose.model("Education", edSchema);

export default Education;