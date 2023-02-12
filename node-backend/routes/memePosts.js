import express from "express";
import {
    getFeedPosts,
    getUserPosts,
    likePost,
    createPost
} from "../controllers/memePosts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

const storagePosts = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("saved post");
        cb(null, "public/assets/memes");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

/* READ */
router.get("/", verifyToken, getFeedPosts); // user feed on home page
router.get("/:userId/posts", verifyToken, getUserPosts);

/* WRITE */
router.post("/", verifyToken, multer({ storage: storagePosts }).single("picture"),createPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;