import express from "express";
import {
    getImgs, getUserImgs, createImg
} from "../controllers/memeImgs.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";


const router = express.Router();


/* FILE STORAGE --> a lot of configurations are coming from package instructions*/

//from github repo of multer: how you save a file

const storageImgs = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("saved img");
        cb(null, "public/assets/imgs");
        
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


/* READ */
router.get("/", verifyToken, getImgs);
router.post("/", verifyToken, multer({ storage: storageImgs }).single("picture"),createImg);

export default router;