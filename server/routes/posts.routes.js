import express from "express";
import { getPosts, getPost, getPostBySlug } from "../controllers/posts.controller.js";

const postRouter = express.Router();

postRouter.get("/posts", async (req, res) => {
  const posts = await getPosts();
  return res.status(200).json({ data: posts });
});

postRouter.get("/post/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  const post = await getPostBySlug(slug, req, res);
  if (res.headersSent) return;
  return res.status(200).json({ data: post });
});

postRouter.get("/post/:id", async (req, res) => {
  const { id } = req.params;  
  const post = await getPost(id, req, res);
  if (res.headersSent) return;
  return res.status(200).json({ data: post });
});

export default postRouter;
