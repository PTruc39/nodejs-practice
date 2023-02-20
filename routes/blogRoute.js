const express = require('express');
const router = express.Router();
const {
    createBlog, getAllBlogs, deleteBlog
    ,updateBlog, getBlog, likeBlog,
    disliketheBlog
   
} =require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/",getAllBlogs);
router.get("/:id",getBlog);
router.post("/like",authMiddleware,likeBlog);
router.post("/dislike",authMiddleware,disliketheBlog);

router.post("/create",createBlog);
router.post("/update",updateBlog);
router.post("/:id",deleteBlog);



module.exports=router;
