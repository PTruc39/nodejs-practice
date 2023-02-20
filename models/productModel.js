const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
      },
      quantity: Number,
      images:{
        type: Array,
      },
      brand:{
        type: String,
        enum: ["Apple","SS","Lenovo"],
      },
      color:{
        type: String,
        enum: ["Black","Brown","Blue"],
      },
      sold: {
        type: Number,
        default: 0,
      },
      ratings: [
        {
          star: Number,
          comment: String,
          postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      totalrating:{
        type: String,
        default:0
      }

}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Product', productSchema);