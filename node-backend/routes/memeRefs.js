import express from "express";
import {
    getFeedPosts,
} from "../controllers/memeRefs.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
//router.get("/", verifyToken, getFeedPosts); // user feed on home page
router.get("/:userId/refs", verifyToken, getFeedPosts);

export default router;