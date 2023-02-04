import User from "../models/User.js";
import MemeRef from "../models/MemeRef.js";
import MemePost from "../models/MemePost.js";

export const createRef = async (req, res) => {
    try {
        //what frontend sends us
        const { userId, picturePath } = req.body;
        const user = await User.findById(userId);
        const newRef = new MemeRef({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            picturePath,
            userPicturePath: user.picturePath,
        });
        await newRef.save(); //save to mongodb
        
        //this grabs ALL posts
        const post = await MemeRef.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
};

export const getRefs = async (req, res) => {
    try {        
        //this grabs ALL posts
        const post = await MemeRef.find();
        console.log("........finding all refs on server: "+post)
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message +" couldn't fetch memes" });
    }
};

export const getUserRefs = async (req, res) => {
    try { 
        const { userId } = req.params;
        const post = await MemeRef.find({ userId });
        //this grabs ALL posts
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

export const useRef = async (req, res) => {
    try { 
        const { id } = req.params;
        const { postId } = req.body;
        const ref = await MemeRef.findById(id);

        const posts = await MemePost.posts.map((post) => {
            if (post._id === postId) {
                posts.add(post);
            }
        });

        const updatedRef = await MemeRef.findByIdAndUpdate(
            id,
            { useCount: posts.length },
            {posts: posts},
            { new: true }
        );

        res.status(200).json(updatedRef);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};