import Post from "../models/blog.js";

//Create and save a new post
const createPost = async(post, sectionName) =>{
    try{
        const newPost = new sectionName({
            title: post.title,
            body: post.body,
            coverImg: post.coverImg,
            tags: post.tags,
            author: post.author,
            date: post.date
        })
        await newPost.save();
        return newPost;
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
const getPost = async(date, title) =>{
    let post;
    await Post.findOne({date: date, title: title}).then((result) =>{
        post = result;
    });
    return post;
}

export  {createPost, getPosts, getPost};