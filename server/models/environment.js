import mongoose from "mongoose";

const envSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Environment = mongoose.model("Environment", envSchema);

export default Environment;