import mongoose from "mongoose";
const postSchema = mongoose.Schema(
    {
        userId: {
        type: String,
        },
        firstName: {
        type: String,
        },
        lastName: {
        type: String,
        },
        userName: { 
        type: String,
        },
        picturePath: String,
        userPicturePath: String,
    },
    { timestamps: true }
);

const MemeImg= mongoose.model("MemeImg", postSchema);

export default MemeImg;
