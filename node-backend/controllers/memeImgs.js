import User from "../models/User.js";
import MemeImg from "../models/MemeImg.js";
import debug from "debug";

export const createImg = async (req, res) => {
    try {
        //what frontend sends us
        const { userId,  pictureName } = req.body;
        //const user = await User.findById(userId);
        const newImg = new MemeImg({
            picturePath: `imgs/${pictureName}`,
        });
        await newImg.save(); //save to mongodb
        
        //this grabs ALL posts
        const post = await MemeImg.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
};

export const getImgs = async (req, res) => {
    try {        
        //this grabs ALL posts
        const post = await MemeImg.find();
        debug("........finding all imgs on server: "+post)
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message +" couldn't fetch meme images" });
    }
};

export const getUserImgs = async (req, res) => {
    try { 
        const { userId } = req.params;
        //const post = await MemeImg.find({ userId });
        //this grabs ALL posts
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};