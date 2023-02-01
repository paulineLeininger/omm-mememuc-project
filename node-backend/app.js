import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
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

//import single function from controller 
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/memePosts.js";
import User from "./models/User.js";
import MemePost from "./models/MemePost.js";
import { users, posts, refs } from "./data/index.js";
import MemeRef from "./models/MemeRef.js";


//import { indexRouter } from "./routes/index.js"
//import { userRouter } from "./routes/users.js"


// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
//const MONGODB_PORT = process.env.DBPORT || '27017';
//const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
//console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)
// ###### --> replaced by mongoose

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

//var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
//create app
const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // sets dir of our assets

/*app.use(function(req,res,next){  req.db = db;
  next();
});*/


// the login middleware. Requires BasicAuth authentication
/*app.use((req,res,next) => {
  const users = db.get('users');
  users.findOne({basicauthtoken: req.headers.authorization}).then(user => {
    if (user) {
      req.username = user.username;  // test test => Basic dGVzdDp0ZXN0
      next()
    }
    else {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send()
    }
  }).catch(e => {
    console.error(e)
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send()
  })
})*/

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

/*

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

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
    })
  .catch((error) => console.log(`${error} did not connect`));
    
export default app;
