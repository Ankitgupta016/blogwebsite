const UserData = require("../models/register.js");

const isadminLogin=async(req,res,next)=>{
    try {
        if (req.session.user_id) {
            
        }else{
            res.redirect("/admin/");
        }
        next();
    } catch (error) {
       
    }
}

const isadminLogout = async(req,res,next)=>{
    try {
        if (req.session.user_id) {
            res.redirect("/admin/");
        }
        next();
    } catch (error) {
       
    }
 }

 // Middleware function to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
      const adminData = await UserData.findById(req.session.user_id);
  
      if (adminData && adminData.is_admin === 1) {
        // If user exists and is an admin, proceed to the next middleware or route handler
        next();
      } else {
        // If user does not exist or is not an admin, redirect to login page or show an error
        res.redirect("/admin/"); // Or you can show an error message
      }
    } catch (error) {
     
    }
  };
  
  
  
 module.exports = {
    isadminLogin,isadminLogout,isAdmin
 }