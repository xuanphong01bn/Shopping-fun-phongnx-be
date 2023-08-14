const express = require("express");
const router = express.Router();
import { authCheck, adminCheck } from "../middlewares/auth.js";

const {
  sendEmail,
  checkFileExist,
} = require("../controllers/emailControllers");

router.post("/sendEmail", authCheck, adminCheck, sendEmail);
router.post("/checkFile", authCheck, adminCheck, checkFileExist);

module.exports = router;
