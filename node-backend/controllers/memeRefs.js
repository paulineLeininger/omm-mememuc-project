import User from "../models/User.js";
import MemeRef from "../models/MemeRefs.js";

export const createPost = async (req, res) => {
    try {
        //what frontend sends us
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new MemeRef({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            picturePath,
            userPicturePath: user.picturePath,
        });
        await newPost.save(); //save to mongodb
        
        //this grabs ALL posts
        const post = await MemeRef.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {        
        //this grabs ALL posts
        const post = await MemeRef.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message +"couldn't fetch memes" });
    }
};

export const getUserPosts = async (req, res) => {
    try { 
        const { userId } = req.params;
        const post = await MemeRef.find({ userId });
        //this grabs ALL posts
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
