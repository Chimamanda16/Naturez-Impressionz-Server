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
const createPost = async(post, sectionName) =>{
    try{
        const newSectionPost = new sectionName({
            title: post.title,
            body: post.body,
            coverImg: post.coverImg,
            tags: post.tags,
            author: post.author,
            date: post.date
        })
         const newPost = new Post({
            title: post.title,
            body: post.body,
            coverImg: post.coverImg,
            tags: post.tags,
            author: post.author,
            date: post.date
        })
        await newSectionPost.save();
        await newPost.save();
        return (newPost, newSectionPost);
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
    console.log(post.title, req.headers["user-agent"])
    if(!post) return(res.status(404).send("Post not Found")) 
    if (isBot(req.headers["user-agent"])) {
        let slug = slugify(post.title)
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>${post.title} | NINews Blog</title>
                    <meta name="description" content="Reporting News with Clarity and Credibility" />
                    <meta property="og:title" content="${post.title} | NINews Blog" />
                    <meta property="og:description" content="Reporting News with Clarity and Credibility" />
                    <meta property="og:image" content="${post.coverImg}" />
                    <meta property="og:url" content="https://ninews.ng/blog/${post._id}/${post.date}/${slug}" />
                    <meta property="og:type" content="article" />
                </head>
                <body>
                    <h1>${post.title}</h1>
                </body>
            </html>
        `);
        return post;
    }
    return post;
}

export  {createPost, getPosts, getPost};