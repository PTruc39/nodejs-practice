const express = require('express');
const router = express.Router();
const { createCategory,
    updateCategory,
    getCategory,
    getallCategory,
    deleteCategory
    
   
} =require("../controller/categoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/",getallCategory);
router.get("/:id",getCategory);
router.post("/create",createCategory);
router.put("/update/:id",updateCategory);
router.put("/delete/:id",deleteCategory);

module.exports=router;