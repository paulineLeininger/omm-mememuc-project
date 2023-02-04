import express from "express";
import {
    getRefs, getUserRefs, useRef
} from "../controllers/memeRefs.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getRefs);
router.get("/:userId/refs", verifyToken, getUserRefs);
router.get("/:userId/:refId/refs", verifyToken, getRefs);

/* UPDATE */
router.patch("/:id/use", verifyToken, useRef);

export default router;