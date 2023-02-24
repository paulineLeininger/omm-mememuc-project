import User from "../models/User.js";
import MemePost from "../models/MemePost.js";

export const createPost = async (req, res) => {
    
    try {
        //what frontend sends us
        const {
            userId,
            topCaption,
            middleCaption,
            bottomCaption,
            description,
            font,
            fontSize,
            fontColor,
            topCaptionX,
            topCaptionY,
            middleCaptionX,
            middleCaptionY,
            bottomCaptionX,
            bottomCaptionY,
            picturePath,
            isPrivate,
            isUnlisted
        } = req.body;
        const user = await User.findById(userId);
        console.log(req.body)
        const newPost = new MemePost({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            location: user.location,
            topCaption,
            middleCaption,
            bottomCaption,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            font,
            fontColor,
            fontSize,
            topCaptionX,
            topCaptionY,
            middleCaptionX,
            middleCaptionY,
            bottomCaptionX,
            bottomCaptionY,
            isPrivate,
            isUnlisted,
            likes: {},
            comments: []

        });
        await newPost.save(); //save to mongodb
        
        //this grabs ALL posts
        const post = await MemePost.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
};

/* READ */

export const getFeedPosts = async (req, res) => {
    try {        
        //this grabs ALL posts
        const post = await MemePost.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try { 
        const { userId } = req.params;
        const post = await MemePost.find({ userId });
        //this grabs ALL posts
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/* PATCH */

export const addComment = async (req, res) => {
    try {
        const { id} = req.params;
        const { userId, comment } = req.body;
        const post = await MemePost.findById(id);
        const comments = post.comments;
        const user = await User.findById(userId);
        const userName = user.userName;
        comments.push(`${userName}: ${comment}`);
        const updatedPost = await MemePost.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );
        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export const likePost = async (req, res) => {
    try { 
        const { id } = req.params;
        const { userId } = req.body;
        const post = await MemePost.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }
        const updatedPost = await MemePost.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};