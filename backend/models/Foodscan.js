const mongoose = require("mongoose");

const foodScanSchema = new mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  ingredients:[String],

  additives:[String],

  novaClass:String,

  toxicityScore:Number,

  metabolicStress:String,

  explanation:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("FoodScan", foodScanSchema); 