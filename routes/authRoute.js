const express = require('express');
const router = express.Router();
const { getAllUser, createUser, login,
    getaUser,deleteaUser,updatedUser,
    unblockUser, blockUser, handleRefreshToken,
    logout,sendPass,checkToken,changePassword,
    loginAdmin, getWishlist, userCart,
    getUserCart, emptyCart, applyCoupon,
    createOrder, getAllOrders, getOrderByUserId,
    getOrders, updateOrderStatus
    

} =require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
router.get("/getwish",authMiddleware,getWishlist);
router.get("/",getAllUser);
router.get("/getorders",authMiddleware,getOrders);
router.get("/orders",authMiddleware,getAllOrders);
router.get("/ordersbyuserid/:id",getOrderByUserId);
router.post("/updateorder/:id",authMiddleware,updateOrderStatus);

router.get("/getusercart",authMiddleware,getUserCart);
router.post("/emptycart",authMiddleware,emptyCart);
router.post("/apply",authMiddleware,applyCoupon);
router.post("/cart",authMiddleware,userCart);
router.post("/createorder",authMiddleware,createOrder);
router.get("/refresh", handleRefreshToken);
router.post("/register",createUser);
router.post("/login",login);
router.post("/admin",loginAdmin);
router.get("/logout",logout);
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id",deleteaUser);
router.put("/:_id",authMiddleware,updatedUser);
router.put("/block-user/:id", authMiddleware, isAdmin,blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin,unblockUser);



router.post("/sendpasswordlink",sendPass)
router.get("/forgotpassword/:id/:token",checkToken)
router.post("/:id/:token",changePassword)



module.exports=router;