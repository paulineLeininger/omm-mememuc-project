import express from "express";
import {
    createDraft,
    getUserDrafts
} from "../controllers/memeDrafts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

const storagePosts = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("saved draft");
        cb(null, "public/assets/drafts");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

/* READ */
// router.get("/", verifyToken, getDrafts);
router.get("/:userId/", verifyToken, getUserDrafts);
// router.get("/:userId/:refId/refs", verifyToken, getDrafts);

router.post("/", verifyToken, multer({ storage: storagePosts }).single("picture"), createDraft);

/* UPDATE */
// router.patch("/:id/use", verifyToken, useDraft);

export default router;