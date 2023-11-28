const express = require("express");
const router = express();

const bodyparser = require("body-parser");
const session = require("express-session");
const admin = require("../controllers/admincon");
const UserData = require("../models/register.js");
const adminauth = require("../middleware/adminauth");
const Blogpost = require("../models/blogpost.js")
router.use(
  session({
    secret: process.env.Secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

router.use(bodyparser.json());
router.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

const path = require("path");
const multer = require("multer");
router.use(express.static("public"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });


const storageimage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImage"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});
const uploadimage = multer({ storage: storageimage });

const checkAuth = (req, res, next) => {
  if (req.session.user_id) {
    UserData.findById(req.session.user_id)
      .then((userData) => {
        req.admin = userData;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
};
router.use(checkAuth);

router.set("view engine", "hbs");
router.set("views", "./templates/view/admin");



router.get("/home", async (req, res) => {
  try {
    // Retrieve all blog posts
    const blogPosts = await Blogpost.find({});

    let totalViews = 0;
    for (const post of blogPosts) {
      totalViews += post.views;
    }
    let totalLike = 0;
    for (const post of blogPosts) {
      totalLike += post.likes;
    }
    // Count the total number of comments
    let totalComments = 0;
    for (const post of blogPosts) {
      totalComments += post.comments.length;
    }

    res.render("home", { admin: req.user, totalComments,totalViews,totalLike,blogPosts });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get("/adminprofile", adminauth.isadminLogin, async (req, res) => {
  try {
    const userDatas = await UserData.findById(req.session.user_id);
    res.render("adminprofile", { admin: userDatas });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/createpost",(req,res)=>{
  res.render("artical",{ admin: req.user })
})
router.post("/createpost",uploadimage.single("image"),  admin.createpost)

router.get("/", adminauth.isadminLogout, (req, res) => {
  res.render("login");
});
router.post("/", admin.verifyadmin);

router.get("/logout", adminauth.isadminLogout, admin.adminLogout);

router.get("/forget", adminauth.isadminLogout, (req, res) => {
  res.render("forget");
});
router.post("/forget", admin.forgetpassview);

router.get("/forgetpass", adminauth.isadminLogout, admin.forgetpassLoad);

router.post("/forgetpass", admin.resetPassword);
router.get("/deshboard",adminauth.isadminLogin,adminauth.isAdmin, admin.dashboadshow);

router.get("/newuser",adminauth.isadminLogin,adminauth.isAdmin,(req, res) => {
  res.render("newuser");
});

router.post("/newuser",  upload.single("image"), admin.addnewuser);

router.get("/edit-user",adminauth.isadminLogin,admin.updateuser);

router.post("/edit-user", admin.updateuserProfile);


router.get("/delete-user",admin.deleteuser); 

router.get("/exportdata",adminauth.isadminLogin,admin.exportuserdata);


router.get("*", function (req, res) {
  res.render("error");
});

module.exports = router;
