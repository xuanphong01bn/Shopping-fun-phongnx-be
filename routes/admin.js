const express = require("express");

const router = express.Router();
import { authCheck, adminCheck } from "../middlewares/auth.js";

import {
  updateStatus,
  getAllOrderAdmin,
  sendEmailAdmin,
  checkFileExist,
  orderByDay,
  revenue,
  updateSoldAndStockProduct,
  getDetailOrderAdmin,
  topOrder,
  getUserById,
} from "../controllers/admin";
import { productGoodSales } from "../controllers/product";
router.post(
  "/admin/order-status/:orderId",
  authCheck,
  adminCheck,
  updateStatus
);

router.post("/admin/order", authCheck, adminCheck, getAllOrderAdmin);
router.get("/admin/order/:orderId", getDetailOrderAdmin);

router.post("/admin/email/send", authCheck, adminCheck, sendEmailAdmin);
router.post("/admin/checkFile", authCheck, adminCheck, checkFileExist);
router.post("/admin/order-by-day", authCheck, adminCheck, orderByDay);
router.post("/admin/revenue", authCheck, adminCheck, revenue);
router.get("/admin/product-good-sale", authCheck, adminCheck, productGoodSales);

router.post(
  "/admin/update-sold-product",
  authCheck,
  adminCheck,
  updateSoldAndStockProduct
);

router.get("/admin/top-user-order", authCheck, adminCheck, topOrder);

router.get("/admin/user-by-id/:idUser", authCheck, adminCheck, getUserById);

module.exports = router;
