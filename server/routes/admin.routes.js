import express from "express";
import csrf from "csurf"
import { createPost } from "../controllers/posts.controller.js";

const adminRouter = express.Router();
let csrfProtection = csrf({ cookie: true });

adminRouter.post("/post/create/", csrfProtection,  async (req, res)=>{
    try{
        const post = req.body;
        const section = req.params.section;
        let newPost = await createPost(post);
        if(newPost){
            res.status(201).json({message: "Post has been saved successfully"});
        }
        else{
            res.status(500).json({message: "Server Error while saving post"});
        }
    }
    catch(error){
        console.error("Error in post router", error);
        res.status(500).json({message: "Server Error while saving post"});
    }
});

export default adminRouter;