const express = require('express');
const router = express.Router();
var userModel = require('../models/userModel');
const passport = require('passport');
var permit = require('../config/permission');
const LocalStrategy = require('passport-local').Strategy;

// register 

router.get('/users/register', (req, res) => {
     res.render('register');
});

router.get('/admin/login',
          (req,res) => {
               res.render('login', {
                    post_to: '/admin/login'
               });
});

router.get('/admin/dashboard',permit('you are not admin','admin'),(req,res) => {
     res.render('dashboard')
});
// register user
router.post('/users/register', (req, res) => {
     var fullname = req.body.fullname;
     var username = req.body.username;
     var password = req.body.password;
     var retypePassword = req.body.retypePassword;

     req.checkBody('fullname', 'full name is required').notEmpty();
     req.checkBody('username', 'username is required').notEmpty();
     req.checkBody('password', 'password is required').notEmpty();
     req.checkBody('retypePassword', 'retype-password is required').notEmpty();
     req.checkBody('retypePassword', 'retype-password must be match').equals(req.body.password);

     var errors = req.validationErrors();

     if (errors) {
          res.render('register',
               {
                    errors: errors,
               });
          console.log(errors);
     }
     else {
          var newUser = new userModel({
               fullname: fullname,
               username: username,
               password: password
          });
          userModel.createUser(newUser, (err, user) => {
               if (err)
                    throw err;
               console.log("added new user" + user);
               req.flash('success_msg', 'you are registered now you can login');
               res.redirect('/users/login');
          });
     }
});

// login 

router.get('/users/login', (req, res) => {
     res.render('login', {
          post_to: '/users/login'
     });
});

router.get('/users/logout',(req,res) => {
     req.logout();
     req.flash('success_msg','You are log out');
     res.redirect('/');
});
//check username and password with passport local stategy
passport.use(new LocalStrategy(
     (username, password, done) => {
          userModel.getUserByUsername(username,
               (err,user) => {
                    if(err)
                         throw err;
                    if(!user)
                    {
                         return done(null,false,{message:'Unknown User'});
                    }
                    userModel.comparePassword(password, user.password,
                         (err,isMatch) => {
                              if(err)
                                   throw err;
                              if(isMatch)
                                   return done(null,user);
                              else
                                   return done(null,false,{message:'Invalid Password'});
                         });
               });
          
}));

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
router.post('/users/login',
     passport.authenticate('local', {
          successRedirect: '/',
          failureRedirect: '/users/login',
          failureFlash: true
     }),
     (req, res) => {
          res.redirect('/');
     }
)
// check users if authenticated 
router.post('/admin/login',
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