const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import { createPaymentStripe } from "../controllers/stripe";

// routes
router.post("/create-payment-stripe", authCheck, createPaymentStripe);
module.exports = router;
