import express from "express";
import {
    getImgs, getUserImgs,
} from "../controllers/memeImgs.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getImgs);


export default router;