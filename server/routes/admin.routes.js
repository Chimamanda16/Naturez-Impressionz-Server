import express from "express";
import csrf from "csurf"
import { createPost } from "../controllers/createPost.controller.js";
import Economy from "../models/economy.js";
import Education from "../models/education.js";
import Environment from "../models/environment.js";
import Health from "../models/health.js";
import Lifestyle from "../models/lifestyle.js";
import Politics from "../models/politics.js";
import Security from "../models/security.js";
import Tech from "../models/tech.js";
import Life from "../models/lifestyle.js";

const models = {
    economy: Economy,
    education: Education,
    environment: Environment,
    health: Health,
    lifestyle: Lifestyle,
    politics: Politics,
    security: Security,
    tech: Tech,
    life: Life
}

const adminRouter = express.Router();
let csrfProtection = csrf({ cookie: true });

adminRouter.post("/post/create/:section", csrfProtection,  async (req, res)=>{
    try{
        const post = req.body;
        const section = req.params.section;
        let newPost = await createPost(post, models[section.toLowerCase()]);
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