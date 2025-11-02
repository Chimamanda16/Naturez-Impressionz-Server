const express = require("express");
const csrf = require("csurf"); 
const { createPost } = require("../controllers/createPost.controller.js");
const Economy = require("../models/economy.js");
const Education = require("../models/education.js");
const Environment = require("../models/environment.js");
const Health = require("../models/health.js");
const Lifestyle = require("../models/lifestyle.js");
const Politics = require("../models/politics.js");
const Security = require("../models/security.js");
const Tech = require("../models/tech.js");
const Life = require("../models/lifestyle.js");

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
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  } 
});

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

module.exports = adminRouter;