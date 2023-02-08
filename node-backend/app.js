import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/memePosts.js";
import refsRoutes from "./routes/memeRefs.js";
import imgsRoutes from "./routes/memeImgs.js"
//data
import User from "./models/User.js";
import MemePost from "./models/MemePost.js";
import { users, posts, refs, imgs } from "./data/index.js";
import MemeRef from "./models/MemeRef.js";
import MemeImg from "./models/MemeImg.js"


//import single function from controller 
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/memePosts.js";

//var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//create app
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // sets dir of our assets

/* FILE STORAGE --> a lot of configurations are coming from package instructions*/

//from github repo of multer: how you save a file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
//                          middleware function
//                          upload picture in       controller function
//            route         public/assets folder     =logic
//                          (happens before logic)
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/refs", refsRoutes);
app.use("/imgs", imgsRoutes);


/* MONGOOSE SETUP*/

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => { // what happens after we connect
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); // callback function

      /* ADD DATA ONE TIME */

        //User.insertMany(users);
        //MemePost.insertMany(posts);
        //MemeRef.insertMany(refs);
        //MemeImg.insertMany(imgs);
    })
  .catch((error) => console.log(`${error} did not connect`));
    
export default app;
