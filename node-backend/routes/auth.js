import express from "express";
import { login } from "../controllers/auth.js";
import multer from "multer";
import { register } from "../controllers/auth.js";

const router = express.Router();

const storageProfileImgs = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/profileImgs");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

router.post("/login", login); //=auth/login
router.post("/register", multer({ storage: storageProfileImgs }).single("picture"), register);

export default router;
