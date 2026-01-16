import express from "express";
import csrf from "csurf"
import { createPost, deletePost, updatePost } from "../controllers/posts.controller.js";

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

adminRouter.put("/post/:id", csrfProtection, async (req, res)=>{
    try{
        const { id } = req.params;
        const updatedData = req.body;
        const updatedPost = await updatePost(id, updatedData);
        if(updatedPost){
            res.status(200).json({message: "Post updated successfully", data: updatedPost});
        }
        else{
            res.status(404).json({error: "Post not found"});
        }
    }
    catch(error){
        console.error("Error updating post", error);
        res.status(500).json({error: "Server Error while updating post"});
    }
});

adminRouter.delete("/post/:id", csrfProtection, async (req, res)=>{
    try{
        const { id } = req.params;
        const deletedPost = await deletePost(id);
        if(deletedPost){
            res.status(200).json({message: "Post deleted successfully"});
        }
        else{
            res.status(404).json({error: "Post not found"});
        }
    }
    catch(error){
        console.error("Error deleting post", error);
        res.status(500).json({error: "Server Error while deleting post"});
    }
});

export default adminRouter;