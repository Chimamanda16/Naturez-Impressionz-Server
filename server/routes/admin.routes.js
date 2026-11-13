import express from "express";
import jwt from "jsonwebtoken";
import { createPost, deletePost, updatePost } from "../controllers/posts.controller.js";
import { uploadImageToUploadThing } from "../services/uploadthing.js";

const adminRouter = express.Router();

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== "string") return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

const authenticate = (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT error", err);
    res.status(403).json({ error: "Invalid token" });
  }
};

const parseImageBody = express.raw({ type: "image/*", limit: "10mb" });

adminRouter.post("/image/upload", authenticate, (req, res, next) => {
  parseImageBody(req, res, (error) => {
    if (error) {
      return res.status(error.status || 400).json({ error: "Image upload must be an image smaller than 10 MB." });
    }
    next();
  });
}, async (req, res) => {
  try {
    const url = await uploadImageToUploadThing({
      body: req.body,
      contentType: req.headers["content-type"],
    });
    return res.status(201).json({ data: { url } });
  } catch (error) {
    console.error("UploadThing image upload failed", error);
    return res.status(error.status || 500).json({
      error: error.status ? error.message : "Image upload failed. Check UploadThing configuration and try again.",
    });
  }
});

adminRouter.post("/post/create", authenticate, async (req, res) => {
  try {
    const post = req.body;
    const newPost = await createPost(post);
    if (newPost) {
      return res.status(201).json({ message: "Post has been saved successfully", data: newPost });
    }
    return res.status(500).json({ message: "Server Error while saving post" });
  } catch (error) {
    console.error("Error in post router", error);
    res.status(500).json({ message: "Server Error while saving post" });
  }
});

adminRouter.put("/post/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedPost = await updatePost(id, updatedData);
    if (updatedPost) {
      return res.status(200).json({ message: "Post updated successfully", data: updatedPost });
    }
    return res.status(404).json({ error: "Post not found" });
  } catch (error) {
    console.error("Error updating post", error);
    res.status(500).json({ error: "Server Error while updating post" });
  }
});

adminRouter.delete("/post/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await deletePost(id);
    if (deletedPost) {
      return res.status(200).json({ message: "Post deleted successfully" });
    }
    return res.status(404).json({ error: "Post not found" });
  } catch (error) {
    console.error("Error deleting post", error);
    res.status(500).json({ error: "Server Error while deleting post" });
  }
});

export default adminRouter;