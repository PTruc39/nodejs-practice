const express = require('express');
const router = express.Router();
const {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
} =require("../controller/productCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");

router.post(
    "/upload/:id",
    authMiddleware,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
  );

router.post("/create",createProduct);
router.post("/addwish",authMiddleware,addToWishlist);
router.put("/update/:id",updateProduct);
router.put("/rating",authMiddleware,rating);
router.delete("/delete/:id",deleteProduct);
router.get("/:id",getaProduct);
router.get("/",authMiddleware, isAdmin,getAllProduct);



module.exports=router;