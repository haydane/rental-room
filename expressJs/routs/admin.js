
const express = require('express');
const router = express.Router();
var adminModel = require('../models/adminModel');
const passport = require('passport');
var permit = require('../config/permission');
const LocalStrategy = require('passport-local').Strategy;

// login 

router.get('/login', (req, res) => {
     res.render('adminLogin');
});


// dashboard 

router.get('/dashboard',permit('you are not admin','admin')
     ,(req, res) => { 
          res.render('dashboard');
});

router.get('/logout',(req,res) => {
     req.logout();
     req.flash('success_msg','You are log out');
     res.redirect('/admin/login');
})

// //check username and password with passport local stategy
// passport.use(new LocalStrategy(
//      (username, password, done) => {
//           adminModel.getUserByUsername(username,
//                (err,user) => {
//                     if(err)
//                          throw err;
//                     if(!user)
//                     {
//                          return done(null,false,{message:'Unknown Admin'});
//                     }
//                     adminModel.comparePassword(password, user.password,
//                          (err,isMatch) => {
//                               if(err)
//                                    throw err;
//                               if(isMatch)
//                                    return done(null,user);
//                               else
//                                    return done(null,false,{message:'Invalid Password'});
//                          });
//                });
          
// }));

// passport serialize
passport.serializeUser((user, done) => {
     done(null, user.id);
})

// passport diserialize

passport.deserializeUser((id, done) => {
     userModel.getUserById(id, (err, user) => {
          done(err, user);
     });
});

// check users if authenticated 
router.post('/login',
     passport.authenticate('local', {
          successRedirect: '/admin/dashboard',
          failureRedirect: '/admin/login',
          failureFlash: true
     }),
     (req, res) => {
          res.redirect('/admin/dashboard');
     }
)


module.exports = router;