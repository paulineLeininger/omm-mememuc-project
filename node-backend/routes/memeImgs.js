import express from "express";
import {
    getImgs, getUserImgs, createImg
} from "../controllers/memeImgs.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import { createProxyMiddleware } from "http-proxy-middleware";
import fetch from "node-fetch";

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

router.get('/imageProxy', async (req, res) => {
    const imageUrl = req.query.url;
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();
      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      res.send(buffer);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image');
    }
  });
  
router.post("/", verifyToken, multer({ storage: storageImgs }).single("picture"),createImg);

export default router;