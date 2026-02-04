import express from "express";
import { getPosts, getPost } from "../controllers/posts.controller.js";

const postRouter = express.Router();

postRouter.get("/posts", async (req, res) => {
  const posts = await getPosts();
  return res.status(200).json({ data: posts });
});

postRouter.get("/post/:id", async (req, res) => {
  const { id } = req.params;  
  const post = await getPost(id, req, res);
  // If getPost handled the response (bot request), it already sent data
  return res.status(200).json({ data: post });
});

export default postRouter;
