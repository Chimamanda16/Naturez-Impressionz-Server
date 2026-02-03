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
    if (!post) return; // Already handled inside getPost

  // If the request comes from a bot, serve HTML with OG tags
  const userAgent = req.headers["user-agent"] || "";
  const bots = ["facebookexternalhit", "twitterbot", "linkedinbot", "slackbot", "discordbot", "whatsapp", "whatsappbot"];
  const isBot = bots.some(bot => userAgent.toLowerCase().includes(bot));

  if (isBot) {
    const slug = post.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${post.title} | NINews Blog</title>
        <meta name="description" content="${post.body.slice(0, 150)}">
        <meta property="og:title" content="${post.title} | NINews Blog" />
        <meta property="og:description" content="${post.body.slice(0, 150)}" />
        <meta property="og:image" content="${post.coverImg}" />
        <meta property="og:url" content="https://ninews.ng/blog/${post._id}/${post.date}/${slug}" />
        <meta property="og:type" content="article" />
      </head>
      <body>
        <h1>${post.title}</h1>
        <p>${post.body}</p>
      </body>
      </html>
    `);
  }

  // Otherwise, return JSON for your React frontend
  res.status(200).json({ data: post });
});

export default postRouter;