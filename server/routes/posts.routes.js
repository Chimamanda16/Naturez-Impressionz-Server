import express from "express";
import { getPosts, getPost } from "../controllers/posts.controller.js";
import path from "path";
import fs from "fs";

const postRouter = express.Router();
const indexPath = path.resolve(process.cwd(), "dist", "index.html");
const isBot = (ua = "") =>
  /facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot/i.test(ua);

function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

postRouter.get("/posts", async (req, res) => {
  const posts = await getPosts();
  return res.status(200).json({ data: posts });
});

postRouter.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const ua = req.headers["user-agent"] || "";
  
  const post = await getPost(id);
  if (!post) return res.status(404).send("Post not found");
  
  if (isBot(ua)) {
    fs.readFile(indexPath, "utf8", (err, html) => {
          if (err) return res.status(500).send("Error loading page");
          let slug = slugify(post.title);
          const modifiedHtml = html
          .replace(/__TITLE__/g, post.title)
          .replace(/__META_DESCRIPTION__/g, post.title)
          .replace(/__META_OG_TITLE__/g, post.title)
          .replace(/__META_OG_DESCRIPTION__/g, post.title)
          .replace(/__META_OG_IMAGE__/g, post.coverImg)
          .replace(
              /__META_OG_URL__/g,
              `https://ninews.ng/blog/${post._id}/${post.date}/${slug}`
            );
            console.log(modifiedHtml);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(modifiedHtml);
    });

    return;
  }

  return res.status(200).json({ data: post });
});

export default postRouter;
