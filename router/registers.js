const express = require('express');
const router =  express.Router();
const user = require('../controllers/registerc');
const session = require('express-session');


router.use(session({secret:process.env.Secret_key,
    resave :false,
    saveUninitialized: true,
    secret: 'keyboard cat',
     secure: true,
      sameSite:true
}))
const auth = require('../middleware/auth')
const multer = require('multer');
const path = require('path')
   router.use(express.static('public'))
const storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename:function(req,file,cb){
     const name = Date.now()+'_'+file.originalname;
      cb(null,name);
    }
})
const upload = multer({storage:storage});

router.get("/signup", auth.isLogout, (req, res) => {
    res.render('signup');
})

router.get("/verify",user.verifyPage);

router.post('/signup',upload.single('image'), user.insertData)

router.post("/verify", user.verifyOTP);

router.post("/signin",user.verifylogin);
router.post("/contact",user.contact)

router.post('/forget', user.forgetpass)

router.post("/forgetpass", user.resetPassword);
router.post("/verification", user.verificationLoad);


router.post('/edit',upload.single('image'), user.updateProfile)


module.exports = router;