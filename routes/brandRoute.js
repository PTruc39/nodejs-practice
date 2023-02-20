const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/",getallBrand);
router.get("/:id",getBrand);
router.post("/create",createBrand);
router.put("/update/:id",updateBrand);
router.put("/delete/:id",deleteBrand);

module.exports=router;