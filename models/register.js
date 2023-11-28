const mongoose = require("mongoose");



const registerSchema = new mongoose.Schema({
  image:{
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,

      minlength:[6, "minnimum 6letters" ],
      maxlength:30,
  },
  number: {
    type: Number,
    require: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
 

  password: {
    type: String,
    required: [true, "password is required"],
    // minlength:[6, "minnimum 6letters" ],
    // maxlength:8,
  },

  is_admin: {
    type: Number,
    require: true,
  },
  is_verified: {
    type: Number,
    default:0
  },
  token:{
   type:String,
   default:''
  },
  otp: {
    type: Number
  },

  date: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("UserData", registerSchema);
