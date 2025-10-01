import mongoose from "mongoose";

const politicsSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Politics = mongoose.model("Politics", politicsSchema);

export default Politics;