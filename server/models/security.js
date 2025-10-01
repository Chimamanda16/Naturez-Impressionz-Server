import mongoose from "mongoose";

const secSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Security = mongoose.model("Security", secSchema);

export default Security;