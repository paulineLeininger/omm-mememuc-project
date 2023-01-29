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
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    topText: String,
    bottomText: String,
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const MemePost = mongoose.model("MemePost", postSchema);

export default MemePost;
