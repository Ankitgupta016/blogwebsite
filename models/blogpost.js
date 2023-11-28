const mongoose = require("mongoose");

const blogpostschema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require:true,
  },
  Date: {
    type: Date,
    type: Date,
    default: Date.now,
    get: function(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().padStart(2, '0');
      return `${day}/${month}/${year}`;
    },
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }, 
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  views: {
    type: Number,
    default: 0,
  },
  
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
  }],
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
  }],

  
});
module.exports = mongoose.model("blogpost", blogpostschema);
