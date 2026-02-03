import Post from "../models/blog.js";

function isBot(userAgent = "") {
  const bots = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "whatsapp",
    "whatsappbot"
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
const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).send("Post not found");

  const ua = req.headers["user-agent"] || "";

  if (isBot(ua)) {
    const slug = slugify(post.title);
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${post.title}</title>
          <meta property="og:title" content="${post.title}" />
          <meta property="og:description" content="Reporting News with Clarity and Credibility" />
          <meta property="og:image" content="https://ninews.ng${post.coverImg}" />
          <meta property="og:url" content="https://ninews.ng/blog/${id}/${slug}" />
          <meta property="og:type" content="article" />
        </head>
        <body></body>
      </html>
    `);
  }

  // normal users
  return res.json(post);
};


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