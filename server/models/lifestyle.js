import mongoose from "mongoose";

const lifeSchema = new mongoose.Schema({
  title: String,
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

const Life = mongoose.model("Life", lifeSchema);

export default Life;