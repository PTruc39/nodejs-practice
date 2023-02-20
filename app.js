
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan=require('morgan');
const userrouter = require('./routes/authRoute');
const blogrouter = require('./routes/blogRoute');
const caterouter = require('./routes/categoryRoute');
const couponrouter = require('./routes/CouponRoute');
const brandrouter = require('./routes/brandRoute');
const blogcaterouter = require('./routes/blogCatRoute');
const productrouter = require('./routes/productRoute');
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
const port = process.env.port || 5001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
mongoose.set('strictQuery', true);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB success");
})

app.use("/api/user",userrouter);
app.use("/api/blog",blogrouter);
app.use("/api/cate",caterouter);
app.use("/api/coupon",couponrouter);
app.use("/api/blogcate",blogcaterouter);
app.use("/api/brand",brandrouter);
app.use("/api/product",productrouter);

app.use(notFound);
app.use(errorHandler);

app.use("/api",(req,res)=>{
    res.send("hello ike ");
})

app.listen(port,()=>{
    console.log(`server is running on: ${port}`);
})