import express from "express";
import { getPosts, getPost } from "../controllers/createPost.controller.js";

const postRouter = express.Router();

postRouter.get("/posts", async(req, res) =>{
    console.log("route hit")
    let posts = await getPosts();
    console.log(posts)
    res.status(201).json({data: posts});
});

postRouter.get(`/post/:date/:title`, async(req, res) =>{
    let {date, title} = req.params;
    const post = await getPost(date, title);
    res.status(201).json({data: post})
});

export default postRouter;