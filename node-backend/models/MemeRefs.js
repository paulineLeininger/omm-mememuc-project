import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
        type: String,
        required: true,
        },
        firstName: {
        type: String,
        required: true,
        },
        lastName: {
        type: String,
        required: true,
        },
        userName: { 
        type: String,
        required: true,
        },
        picturePath: String,
        userPicturePath: String,
        likes: {
        type: Map,
        of: Boolean,
        },
    },
    { timestamps: true }
);

const MemeRef= mongoose.model("MemeRef", postSchema);

export default MemeRef;
