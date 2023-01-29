import express from "express";
//import controllers = funktionen, die Aktionen ausführen (=Logic)
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
//create read routes = where we grab information
//we don's save/change anything to/from database
router.get("/:id", verifyToken, getUser); //querystring: if client sends user id
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;