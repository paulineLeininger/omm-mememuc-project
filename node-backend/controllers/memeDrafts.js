import User from "../models/User.js";
import MemeDraft from "../models/MemeDraft.js";

export const createDraft = async (req, res) => {
    try {
        //what frontend sends us
        const {
            userId,
            // topCaption,
            // bottomCaption,
            captions,
            description,
            font,
            fontSize,
            fontColor,
            // topCaptionX,
            // topCaptionY,
            // bottomCaptionX,
            // bottomCaptionY,
            referencePath,
            picturePath,
            isPrivate,
            isUnlisted
        } = req.body;
        const user = await User.findById(userId);
        console.log(req.body)
        const newDraft = new MemeDraft({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            location: user.location,
            captions: JSON.parse(captions),
            // topCaption,
            // bottomCaption,
            description,
            referencePath,
            picturePath,
            userPicturePath: user.picturePath,
            font,
            fontColor,
            fontSize,
            // topCaptionX,
            // topCaptionY,
            // bottomCaptionX,
            // bottomCaptionY,
            isPrivate,
            isUnlisted,
            likes: {},
            comments: []

        });
        await newDraft.save(); //save to mongodb
        
        //this grabs ALL posts
        const post = await MemeDraft.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
};

// export const getDrafts = async (req, res) => {
//     try {        
//         //this grabs ALL posts
//         const post = await MemeDraft.find();
//         console.log("........finding all refs on server: "+post)
//         res.status(200).json(post);
//     } catch (err) {
//         res.status(404).json({ error: err.message +" couldn't fetch memes" });
//     }
// };

export const getUserDrafts = async (req, res) => {
    try { 
        const { userId } = req.params;
        const post = await MemeDraft.find({ userId });
        //this grabs ALL posts
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// export const useDraft = async (req, res) => { //TODO
//     try { 
//         const { id } = req.params;
//         const { postId } = req.body;
//         const ref = await MemeDraft.findById(id);

//         const posts = await MemeDraft.posts.map((post) => {
//             if (post._id === postId) {
//                 posts.add(post);
//             }
//         });

//         const updatedRef = await MemeDraft.findByIdAndUpdate(
//             id,
//             { useCount: posts.length },
//             {posts: posts},
//             { new: true }
//         );

//         res.status(200).json(updatedRef);
//     } catch (err) {
//         res.status(404).json({ error: err.message });
//     }
// };