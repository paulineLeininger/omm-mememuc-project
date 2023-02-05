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
        picturePath: { 
        type: String,
        required: true,
        },
        userPicturePath: String,
        topCaption: String,
        bottomCaption : String,
        useCount: Number,
        isDraft: Boolean,
        font: String,
        fontColor: String,
        fontBackground: String,
        fontSize: Number,
        topCaptionX: Number,
        topCaptionY: Number,
        bottomCaptionX: Number,
        bottomCaptionY: Number,
        canvasHeight: Number,
        canvasWidth: Number,
    },
    { timestamps: true }
);

const MemeRef= mongoose.model("MemeRef", postSchema);

export default MemeRef;
