

 const isLogin = async(req,res,next)=>{
    try {
        if (req.session.user_id) {
            
        }else{
            res.redirect('signin')
        }
        next();
    } catch (error) {
        
    }
 }

 const isLogout = async (req, res, next) => {
    try {
      if (req.session.user_id) { // check if user is not logged in
        res.redirect('/');
      } else {
        next();
      }
    } catch (error) {
    
    }
  };
  
 
  
  
 
 module.exports = {
    isLogin,isLogout,
  
 }