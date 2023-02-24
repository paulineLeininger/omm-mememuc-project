/* MONGOOSE POST SCHEMA FOR USER*/

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    //we pass in an object
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            min: 2,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        location: String,
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;