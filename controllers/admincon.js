const UserData = require("../models/register.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const exceljs = require("exceljs");
const Post = require("../models/blogpost.js");
const { post } = require("jquery");


//*** For admin  Reset password  send mail ***//
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
      subject: "For admin Reset Password",
      html:
        "<p>Hii " +
        name +
        ', please click here to <a href="http://localhost:3000/admin/forgetpass?token=' +
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
        // console.log("Message sent: %s", info.messageId);
        // console.log("email has been send", info.response);
        transport.close();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//*** admin login  ***//
const verifyadmin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res
        .status(400)
        .render("login", { error: "plz filled the filed properly" });
    }

    const adminData = await UserData.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_admin === 0) {
          res.render("login", { error: "Email And password is incorrent" });
        } else {
          req.session.user_id = adminData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.status(400).render("login", { error: "invalid credentials" });
      }
    } else {
      res
        .status(400)
        .render("login", { error: "Email and Password is incorrect" });
    }
  } catch (error) {
    res.status(400).render("login", { error: "invalid credentials" });
    console.log(error);
  }
};

//*** admin logout method ***//
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin/");
  } catch (error) {
    console.log(error.message);
  }
};

//***  forgetpasswordview ***//
const forgetpassview = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.render("forget", { error: "plz filled the filed properly" });
    }
    const userdata = await UserData.findOne({ email: email });
    if (userdata) {
      if (userdata.is_admin === 0) {
        return res.render("forget", { message: "Please verify your email" });
      } else {
        const randomString = randomstring.generate();

        await UserData.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        sendresetpassymail(userdata.name, userdata.email, randomString);
        return res.render("forget", {
          message: "Please check your email to reset your password",
        });
      }
    } else {
      return res.render("forget", { error: "user email is doesn't e" });
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
      return res.render("error", { message: "We are sorry, page not found!" });
    }
  } catch (error) {
    return res.render("error", {
      message: "We are sorry, Something went wrong",
    });
  }
};
// password create //
const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
    throw error;
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
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

//*** show admin Data ***//

//*** show user list in admin dashboard ***//
const dashboadshow = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    let numberSearch = parseInt(search);
    const usersData = await UserData.find({
      is_admin: 0,
      $or: [
        { name: { $regex: new RegExp(".*" + search + ".*", "i") } },
        { email: { $regex: new RegExp(".*" + search + ".*", "i") } },
        { number: isNaN(+search) ? undefined : +search },
      ],
    });
    res.render("dashboard", { users: usersData });
  } catch (error) {
    console.log(error);
  }
};

//*** Add new  user in admin  ***//
const addnewuser = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const image = req.file.filename;
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const password = randomstring.generate(8);
    const spassword = await securepassword(password);

    if (!image || !name || !email || !number) {
      res
        .status(422)
        .render("newuser", { error: "Please fill all fields properly" });
    }
    const userExist = await UserData.findOne({ email: email });
    if (userExist) {
      res.status(422).render("newuser", { error: "User Email already Exist " });
    }

    const User = new UserData({
      image: image,
      name: name,
      number: number,
      email: email,
      password: spassword,
      is_admin: 0,
      otp: otp,
    });
    const result = await User.save();
    if (!result) {
      throw new Error("User creation failed");
    }
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
        html: `Your OTP for verification is:<b> ${otp}</b> <br> and Your password is :<b> ${password}</b>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Failed to send OTP");
        } else {
          console.log(`OTP sent to ${email}: ${otp}`);
          res.redirect(`/verify?id=${result._id}`);
        }
      });
    } else {
      res.render("newuser", { error: "invalid details" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(422)
      .render("newuser", { error: "Please fill all fields properly" });
  }
};

//*** Update  users Data method load ***//
const updateuser = async (req, res) => {
  try {
    const id = req.query.id;
    const UpdateData = await UserData.findById(id);
    if (UpdateData) {
      res.render("edit-user", { user: UpdateData });
    } else {
      res.redirect("/admin/deshboard");
    }
  } catch (error) {}
};

//***  Update  users Data  in admin  ***//
const updateuserProfile = async (req, res) => {
  try {
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
    res.redirect("/admin/deshboard");
  } catch (error) {
    console.log(error);
  }
};

//*** Delete users Data  in admin  ***//
const deleteuser = async (req, res) => {
  try {
    const id = req.query.id;
    await UserData.deleteOne({ _id: id });
    res.redirect("/admin/deshboard");
  } catch (error) {
    console.log(error);
  }
};
//*** Export users Data in xml formate  in admin  ***//
const exportuserdata = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My User");
    worksheet.columns = [
      { header: "S.no.", key: "S_no", width: 5 },
      { header: "Name", key: "name", width: 23 },
      { header: "Email ID", key: "email", width: 28 },
      { header: "Number", key: "number", width: 15 },
      { header: "Image", key: "image", width: 43 },
      { header: "Verified", key: "is_verified", width: 10 },
      { header: "Admin", key: "is_admin", width: 10 },
    ];

    let counter = 1;
    const result = await UserData.find({ is_admin: 0 });
    result.forEach((user) => {
      user.S_no = counter;
      worksheet.addRow(user);
      counter++;
    });
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);
    workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {}
};

const createpost = async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.file.filename;

    const post = new Post({
      title: title,
      content: content,
      image:image
    });

    const postdata = await post.save();
  
    return res.render("artical", { message: "Post added successfully!" });
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  verifyadmin,
  adminLogout,
  forgetpassview,
  forgetpassLoad,
  resetPassword,
  dashboadshow,
  addnewuser,
  updateuser,
  updateuserProfile,
  deleteuser,
  exportuserdata,
  createpost
};
