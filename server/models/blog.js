import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, trim: true },
  coverImg: String,
  body: String,
  tags: String,
  author: String,
  date: String
})

postSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Post = mongoose.model("Post", postSchema);

export default Post;