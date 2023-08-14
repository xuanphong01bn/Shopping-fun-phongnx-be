const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import { addNotification, getListNoti } from "../controllers/notification";

// routes
router.post("/add-notification", addNotification);
router.get("/list-notification", authCheck, adminCheck, getListNoti);

module.exports = router;
