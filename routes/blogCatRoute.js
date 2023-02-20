const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/blogCatCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/",getallCategory);
router.get("/:id",getCategory);
router.post("/create",createCategory);
router.put("/update/:id",updateCategory);
router.put("/delete/:id",deleteCategory);

module.exports=router;