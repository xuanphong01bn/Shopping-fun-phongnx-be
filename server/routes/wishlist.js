const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import {
  createList,
  getWishList,
  updateWishlist,
} from "../controllers/wishlist";

// routes
router.post("/wishlist", authCheck, createList);
router.get("/wishlist/:userId", authCheck, getWishList);
router.post("/wishlist-update", authCheck, updateWishlist);

module.exports = router;
