const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import { create, remove, list, applyCoupon } from "../controllers/coupon";

// routes
router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupon", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);
// apply coupon
router.post("/user/cart/coupon", authCheck, applyCoupon);
module.exports = router;
