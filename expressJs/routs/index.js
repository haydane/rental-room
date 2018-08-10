const express = require('express');
const router = express.Router();

// route to index

router.get('/',(req,res) => {
     res.render('index');
});

// check user if login
function ensureAuthenticated(req,res,next)
{
     if(req.isAuthenticated())
     {
          return next();
     }
     else
          res.redirect('/users/login');
}

module.exports = router;