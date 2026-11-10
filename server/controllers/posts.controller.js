import Post from "../models/blog.js";
import Agent from "../models/agent.js";
import { generateUniqueSlug, isDuplicateSlugError } from "../utils/slug.js";

function isBot(userAgent = "") {
    const newAgent = new Agent({
    name:userAgent

    })
  newAgent.save()
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "LinkedInBot",
    "slackbot",
    "discordbot",
    "whatsapp",
    "WhatsApp",
    "Whatsapp",
  ];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
}

function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
}

function renderPostMetadata(post, url) {
    const sanitizeText = (text = "") => String(text)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const description = sanitizeText(String(post.body ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160));
    const title = sanitizeText(post.title);
    const image = sanitizeText(post.coverImg);

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>${title} | NINews</title>
                <meta name="description" content="${description}" />
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:image:secure_url" content="${image}" />
                <meta property="og:url" content="${url}" />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="${title}" />
                <meta name="twitter:description" content="${description}" />
                <meta name="twitter:image" content="${image}" />
            </head>
            <body><h1>${title}</h1></body>
        </html>
    `;
}

function respondWithPost(post, req, res, publicUrl) {
    if (!post) {
        res.status(404).send("Post not Found");
        return null;
    }

    if (isBot(req.headers["user-agent"])) {
        res.type("html").send(renderPostMetadata(post, publicUrl));
        return null;
    }

    return post;
}

//Create and save a new post
const createPost = async(post) =>{
    const newPost = new Post({
            title: post.title,
            slug: await generateUniqueSlug(post.title),
            body: post.body,
            coverImg: post.coverImg,
            tags: post.tags,
            author: post.author,
            date: post.date
    });

    while (true) {
        try {
            await newPost.save();
            return newPost;
        } catch (error) {
            if (!isDuplicateSlugError(error)) throw error;
            newPost.slug = await generateUniqueSlug(post.title);
        }
    }
}

//Get all posts
const getPosts = async() =>{
    let posts;
    await Post.find({}).then((result) =>{
        posts = result;
    });
    return posts;
}

//Get particular post
const getPost = async(id, req, res) =>{
    const post = await Post.findById(id);
    const canonicalUrl = post?.slug
        ? `https://www.ninews.ng/${encodeURIComponent(post.slug)}`
        : `https://www.ninews.ng/blog/${post?._id}/${encodeURIComponent(post?.date ?? "")}/${slugify(post?.title ?? "")}`;
    return respondWithPost(post, req, res, canonicalUrl);
}

const getPostBySlug = async(slug, req, res) =>{
    const post = await Post.findOne({ slug });
    return respondWithPost(post, req, res, `https://www.ninews.ng/${encodeURIComponent(slug)}`);
}

//Delete a post
const deletePost = async(id) =>{
    try{
        const deletedPost = await Post.findByIdAndDelete(id);
        return deletedPost;
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

//Update a post
const updatePost = async(id, updatedData) =>{
    const post = await Post.findById(id);
    if (!post) return null;

    const titleChanged = typeof updatedData.title === "string" && updatedData.title !== post.title;
    const postUpdates = { ...updatedData };
    delete postUpdates.slug;
    Object.assign(post, postUpdates);

    if (post.slug && titleChanged) {
        post.slug = await generateUniqueSlug(updatedData.title, post._id);
    }

    while (true) {
        try {
            await post.save();
            return post;
        } catch (error) {
            if (!post.slug || !isDuplicateSlugError(error)) throw error;
            post.slug = await generateUniqueSlug(post.title, post._id);
        }
    }
}

export  {createPost, getPosts, getPost, getPostBySlug, deletePost, updatePost};