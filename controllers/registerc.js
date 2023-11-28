const UserData = require("../models/register.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const randomstring = require("randomstring");
const Contact = require("../models/contact.js")

//*** For Reset password  send mail ***//
const sendresetpassymail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,

      auth: {
        user: process.env.useemail,
        pass: process.env.usepass,
      },
    });

    const mailOptin = {
      from: process.env.useemail,
      to: email,
      subject: "For Reset Password",
      html:
        "<p>Hii " +
        name +
        ', please click here to <a href="http://localhost:3000/forgetpass?token=' +
        token +
        '">Reset </a> Password</p>' +
        "<br>" +
        ' <a href="http://localhost:3000/contact "> ContactUs</a>  ' +
        '    <a href="http://localhost:3000/about "> AboutUs</a>  ' +
        '   <a href="http://localhost:3000/terms&Conditions ">Terms&Conditions</a>  ' +
        '   <a href="http://localhost:3000/Privacy&Policy "> Privacy&Policy</a>   ' +
        "<br>" +
        "<hr>" +
        "<small> This is a system generated mail. Please do not reply to this email ID. (1) Call our 24-hour Customer Care (2) Email Us at ankitgupta46178@gmail.com </small>" +
        "<hr>",
    };
    //  console.log(mailOptin);
    transporter.sendMail(mailOptin, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("email has been send", info.response);
        transport.close();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const securepassword = async (password, res) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Create a new user and send OTP via email
const insertData = async (req, res) => {
  const spassword = await securepassword(req.body.password);
  try {
    const image = req.file.filename;
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const password = spassword;
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (!image || !name || !email || !number || !password) {
      res
        .status(422)
        .render("signup", { error: "Please fill all fields properly" });
    }
    const userExist = await UserData.findOne({ email: email });
    if (userExist) {
      res.status(422).render("signup", { error: "User Email already Exist " });
    }

    const User = new UserData({
      image: image,
      name: name,
      number: number,
      email: email,
      password: password,
      is_admin: 0,
      otp: otp,
    });
    const result = await User.save();
    console.log("🎈 ~ file: registerc.js:150 ~ insertData ~ result:", result);
    if (result) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        auth: {
          user: process.env.useemail,
          pass: process.env.usepass,
        },
      });

      const mailOptions = {
        from: process.env.useemail,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for verification is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Failed to send OTP");
        } else {
          console.log(`OTP sent to ${email}: ${otp}`);
          res.redirect(`/verify?id=${result._id}`); // Render verify page after OTP email is sent
        }
      });
    } else {
      res.render("signup", { error: "invalid details" });
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyPage = (req, res) => {
  const userId = req.query.id;
  res.render("verify", { id: userId });
};

const verifyOTP = async (req, res) => {
  try {
    const otp = req.body.otp;

    console.log("🎈 ~ file: registerc.js:192 ~ verifyOTP ~ otp:", otp);
    // Find the user by OTP
    const result = await UserData.findOne({ otp: otp });

    if (!result) {
      res.status(400).send("Invalid OTP");
    } else {
      const updateInfo = await UserData.updateOne(
        { _id: req.query.id },
        { $set: { is_verified: 1 } }
      );
      console.log("OTP verified successfully");
      res.redirect("/signin");
    }
  } catch (error) {
    console.log(error);
  }
};

//*** chack login method ***//
const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      res
        .status(400)
        .render("signin", { error: "plz filled the filed properly" });
    }
    const result = await UserData.findOne({ email: email });

    if (result) {
      const passwordMatch = await bcrypt.compare(password, result.password);
      // console.log("🎈 ~ file: registerc.js:233 ~ verifylogin ~ passwordMatch:", passwordMatch);

      if (passwordMatch) {
        if (result.is_verified === 0) {
          res.render("signin", { message: "please verify your mail" });
        } else {
          req.session.user_id = result._id;
          res.redirect("/");
        }
      } else {
        res.status(400).render("signin", { error: "invalid credentials" });
      }
    } else {
      res
        .status(400)
        .render("signin", { error: "Email and Password is incorrect" });
    }
  } catch (error) {
    res.status(400).render("signin", { error: "Something went wrong....." });
   
  }
};

//***  Homepage load method ***//
const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
   
  }
};
//*** userlogout method ***//
const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/signin");
  } catch (error) {
    console.log(error.message);
  }
};
//*** forgetpassword  method ***//

const forgetpass = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.render("forget", { error: "plz filled the filed properly" });
    }
    const result = await UserData.findOne({ email: email });

    if (result) {
      if (result.is_verified === 0) {
        return res.render("forget", { message: "Please verify your email" });
      } else {
        const randomString = randomstring.generate();

        await UserData.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );

        sendresetpassymail(result.name, result.email, randomString);

        return res.render("forget", {
          message: "Please check your email to reset your password",
        });
      }
    } else {
      return res.render("forget", { error: "plz filled the filed properly" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("forget", { error: "Something went wrong" });
  }
};
//*** forgetpassLoad method ***//
const forgetpassLoad = async (req, res) => {
  try {
    const token = req.query.token;

    const tokenData = await UserData.findOne({ token: token });
    if (tokenData) {
      return res.render("forgetpass", { user_id: tokenData._id });
    } else {
      return res.render("404", { message: "We are sorry, page not found!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("404", { message: "We are sorry, Something went wrong" });
  }
};

//*** resetPassword method ***//
const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;
    const passwordHash = await securepassword(password);
    const passwordUpdate = await UserData.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: passwordHash, token: "" } }
    );
    res.redirect("/signin");
  } catch (error) {
    console.log(error.message);
  }
};

// Send verification mail Link
const verificationLoad = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const email = req.body.email;

    const result = await UserData.findOne({ email: email });
    if (!email) {
      return res
        .status(400)
        .render("verification", { error: "Please fill the field properly" });
    }
    if (result) {
      if (result.is_verified) {
        res.render("verification", {
          message: "Your email is already verified",
          is_verified: true,
        });
      } else {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,

          auth: {
            user: process.env.useemail,
            pass: process.env.usepass,
          },
        });

        const mailOptions = {
          from: process.env.useemail,
          to: email,
          subject: "OTP Verification",
          text: `Your OTP for verification is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).send("Failed to send OTP");
          } else {
            console.log(`OTP sent to ${email}: ${otp}`);

            // Update the OTP in UserData model
            result.otp = otp;
            result.save(); // Save the updated data

            res.redirect(`/verify?id=${result._id}`); // Render verify page after OTP email is sent
          }
        });
      }
    } else {
      res.render("verification", {
        error: "This user email does not exist.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ***  user Edit Own profile page ***//
const editLoad = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new Error("Id parameter is missing.");
    }

    const UpdateData = await UserData.findById(id);

    if (UpdateData) {
      res.render("edit", { user: UpdateData });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// ***  user update  profile page ***//
const updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const Upadateprofile = await UserData.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email,
            image: req.file.filename,
          },
        }
      );
    } else {
      const Upadateprofile = await UserData.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email,
          },
        }
      );
    }
    res.redirect("/userprofile");
  } catch (error) {
  
  }
};

const contact = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

  
      const contactdata = new Contact({
        name: name,
        email: email,
        subject: subject,
        message: message
      });

      const conresult = await contactdata.save();
      console.log("🚀 ~ contact ~ conresult:", conresult);

      res.status(200).render("contact", { message: "Your message was sent, thank you!" });
  
  } catch (error) {
   res.status(400).render("contact", { error: "Something went wrong....." });
  }
};


module.exports = {
  insertData,
  verifyOTP,
  verifylogin,
  loadHome,
  userLogout,
  forgetpass,
  forgetpassLoad,
  resetPassword,
  verificationLoad,
  editLoad,
  updateProfile,
  verifyPage,
  contact
  // deleteuser
}
