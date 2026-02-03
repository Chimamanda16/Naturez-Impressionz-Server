import Post from "../models/blog.js";

function isBot(userAgent = "") {
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "whatsapp"
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

//Create and save a new post
const createPost = async(post) =>{
    try{
         const newPost = new Post({
            title: post.title,
            body: post.body,
            coverImg: post.coverImg,
            tags: post.tags,
            author: post.author,
            date: post.date
        })
        await newPost.save();
        return (newPost);
    }
    catch(err){
        console.error(err);
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
    let post;
    await Post.findOne({_id: id}).then((result) =>{
        post = result;
    });
    if(!post) return(res.status(404).send("Post not Found")) 
    if (isBot(req.headers["user-agent"])) {
        let slug = slugify(post.title)
        // Sanitize text to prevent XSS and HTML breaking
        const sanitizeText = (text) => text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const bodyPreview = sanitizeText(post.body).substring(0, 160); // First 160 chars
        
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>${sanitizeText(post.title)} | Naturez Impressionz</title>
                    <meta name="description" content="${bodyPreview}..." />
                    <meta property="og:title" content="${sanitizeText(post.title)}" />
                    <meta property="og:description" content="${bodyPreview}..." />
                    <meta property="og:image" content="${post.coverImg}" />
                    <meta property="og:image:type" content="image/webp" />
                    <meta property="og:url" content="https://ninews.ng/blog/${post._id}/${post.date}/${slug}" />
                    <meta property="og:type" content="article" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="${sanitizeText(post.title)}" />
                    <meta name="twitter:description" content="${bodyPreview}..." />
                    <meta name="twitter:image" content="${post.coverImg}" />
                </head>
                <body>
                    <h1>${sanitizeText(post.title)}</h1>
                </body>
            </html>
        `);
    }
    return post;
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
    try{
        const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true });
        return updatedPost;
    }
    catch(err){
        console.error(err);
        throw err;
    }
}

export  {createPost, getPosts, getPost, deletePost, updatePost};