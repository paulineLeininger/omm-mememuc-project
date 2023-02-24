/* MONGOOSE POST SCHEMA FOR MEMEPOST*/

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
    topCaption: String,
    bottomCaption: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    font: String,
    fontColor: String,
    fontSize: Number,
    topCaptionX: Number,
    topCaptionY: Number,
    bottomCaptionX: Number,
    bottomCaptionY: Number,
    isPrivate: Boolean,
    isUnlisted : Boolean,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const MemePost = mongoose.model("MemePost", postSchema);

export default MemePost;
