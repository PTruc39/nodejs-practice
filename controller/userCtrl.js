//const jwt  = require("jsonwebtoken");
const User =require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const {generateRefreshToken}=require("../config/refreshToken");
const jwt = require('jsonwebtoken');
const { get } = require("mongoose");

const keysecret = "8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb"
const keysecretrefresh ="m3XPZZfNkshsuebr00009883llmjvvhvEPHAB6iHsc0fb"
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"tibutibu39@gmail.com",
        pass:"mbgnxdpiyxigwnix"
    }
}) 




const getAllUser =asyncHandler( async (req, res, next) => {
    let users;
    try {
      users = await User.find();
    } catch (err) {
      console.log(err);
    }
    if (!users) {
      return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users });
  });

  const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const getaUser = await User.findById(id);
      res.json(
        getaUser
      );
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleteaUser = await User.findByIdAndDelete(id);
      res.json({
        deleteaUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

const createUser = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser)
    {
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else{
        throw new Error("exited dcm m");
    }

});

const login = asyncHandler(async(req,res,next)=>{
  const {email,password}=req.body;
  const findUser = await User.findOne({email});
  if(findUser && await findUser.isPasswordMatched(password))
  {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({updateuser,
      json:generateToken(findUser._id,findUser.role)
      });
  }
  else{
    throw new Error("login failed!");
  }

})

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, "123", (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id,user?.role);
    res.json({ accessToken });
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});


const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.json({message:"logout thanh cong!"}); // forbidden
});



const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
 

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({unblock,
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    console.log(products);
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } 
  catch(err){
      throw new Error(err);
  }

});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});
const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});


  exports.getAllUser=getAllUser;
  exports.createUser=createUser;
  exports.login=login;
  exports.loginAdmin=loginAdmin;
  exports.getaUser=getaUser;
  exports.deleteaUser=deleteaUser;
  exports.updatedUser=updatedUser;
  exports.unblockUser=unblockUser;
  exports.blockUser=blockUser;
  exports.handleRefreshToken=handleRefreshToken;
  exports.logout=logout;
  exports.getWishlist=getWishlist;
  exports.saveAddress=saveAddress;
  exports.userCart=userCart;
  exports.getUserCart=getUserCart;
  exports.emptyCart=emptyCart;
  exports.applyCoupon=applyCoupon;
  exports.createOrder=createOrder;
  exports.getOrders=getOrders;
  exports.getAllOrders=getAllOrders;
  exports.getOrderByUserId=getOrderByUserId;
  exports.updateOrderStatus=updateOrderStatus;


//Change password
const sendPass = async (req, res, next) => {
  console.log(req.body)
  const {email} = req.body;
  if(!email){
      res.status(401).json({status:401,message:"Enter Your Email"})
  }
  try {
      const userfind = await User.findOne({email:email});

      // token generate for reset password
      const token = jwt.sign({_id:userfind._id},keysecret,{
          expiresIn:"1200s"
      });
      console.log(token);
      
      const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
      //const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token});


      if(setusertoken){
          const mailOptions = {
              from:"tibutibu39@gmail.com",
              to:email,
              subject:"Sending Email For password Reset",
              text:`This Link Valid For 20 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
          }

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.status(401).json({status:401,message:"email not send"})
              }else{
                  console.log("Email sent",info.response);
                  res.status(201).json({status:201,message:"Email sent Succsfully"})
              }
          })

      }

  } catch (error) {
      res.status(201).json({status:401,message:"invalid user"})
  }
};

const checkToken = async(req,res)=>{
  const {id,token} = req.params;

  try {
      const validuser = await User.findOne({_id:id,verifytoken:token});
      
      const verifyToken = jwt.verify(token,keysecret);

      console.log(verifyToken)

      if(validuser && verifyToken._id){
          res.status(201).json({status:201,validuser})
          console.log("token is alive");
      }else{
          res.status(201).json({status:401,message:"user not exist"})

      }

  } catch (error) {
      res.status(201).json({status:401,error})
  }
};

const changePassword = async(req,res)=>{
  const {id,token} = req.params;

  const {password} = req.body;

  try {
      const validuser = await User.findOne({_id:id,verifytoken:token});
      
      const verifyToken = jwt.verify(token,keysecret);

      if(validuser && verifyToken._id){

          const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:password});

          setnewuserpass.save();
          res.status(201).json({status:201,setnewuserpass})
          console.log("done");
      }else{
          res.status(401).json({status:401,message:"user not exist"})
      }
  } catch (error) {
      res.status(401).json({status:401,error})
  }
}





  exports.sendPass=sendPass;
  exports.checkToken=checkToken;
  exports.changePassword=changePassword;
