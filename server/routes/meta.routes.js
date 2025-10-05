// Express server
import express from "express";
import Post from "../models/blog.js";

const metaRouter = express.Router();

function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
}
metaRouter.get("/og", async(req, res) =>{
    console.log("caled")
    res.send("called")
});

metaRouter.get("/og/:id", async (req, res) => {
  const { id } = req.params;  
  // Fetch post from DB
  const post = await Post.findOne({ _id: id});
  console.log(post, id)
  const slug = slugify(post.title)
  if (!post) return res.status(404).send("Post not found");

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${post.title} | NINews Blog</title>
        <meta name="description" content="Reporting News with Clarity and Credibility" />
        <meta property="og:title" content="${post.title} | NINews Blog" />
        <meta property="og:description" content="Reporting News with Clarity and Credibility" />
        <meta property="og:image" content="${post.coverImg}" />
        <meta property="og:url" content="https://ninnews.com/blog/${post._id}/${post.date}/${slug}" />
        <meta property="og:type" content="article" />
      </head>
      <body>
        <h1>${post.title}</h1>
      </body>
    </html>
  `);
});

export default metaRouter;