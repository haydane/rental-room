module.exports = permit = (msg, ...allowed) => {  //...allowed means rest parameter
     const isAllowed = role => allowed.indexOf(role) > -1;
     //return a middle ware
     return (req,res,next) => {
          if(req.user && isAllowed(req.user.role))
          {
               next();
          }
          else
          {
               req.flash('error_msg',msg);
               res.redirect('/admin/login'); 
          }
     }
}