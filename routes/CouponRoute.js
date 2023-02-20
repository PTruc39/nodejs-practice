const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getAllCoupons);
router.put("/update/:id",updateCoupon);
router.delete("/delete/:id", deleteCoupon);

module.exports = router;