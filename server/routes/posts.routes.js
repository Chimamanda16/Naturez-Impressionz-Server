import express from "express";
import { getPosts, getPost } from "../controllers/posts.controller.js";

const postRouter = express.Router();

postRouter.get("/posts", async(req, res) =>{
    let posts = await getPosts();
    res.status(201).json({data: posts});
});

postRouter.get(`/post/:id`, async(req, res) =>{
    let {id} = req.params;
    const post = await getPost(id, req, res);
    res.status(201).json({data: post})
});

export default postRouter;