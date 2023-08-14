const express = require("express");

const router = express.Router();

import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import { upload, remove } from "../controllers/cloudinary";

router.post("/uploadImages", authCheck, adminCheck, upload);
router.post("/removeImages", authCheck, adminCheck, remove);

module.exports = router;
