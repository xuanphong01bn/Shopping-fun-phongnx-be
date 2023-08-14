const express = require("express");

const router = express.Router();

//middlewares
import { authCheck, adminCheck } from "../middlewares/auth.js";
//controller
import { create, read, update, remove, list } from "../controllers/sub";

// routes
router.post("/sub", authCheck, adminCheck, create);
router.get("/subs", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.post("/sub/:slug", authCheck, adminCheck, remove);

module.exports = router;
