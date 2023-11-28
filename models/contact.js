const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    
          minlength:[4, "minnimum 6letters" ],
          maxlength:30,
      },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
    subject:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
      },

})
module.exports = mongoose.model("contactData", contactSchema);