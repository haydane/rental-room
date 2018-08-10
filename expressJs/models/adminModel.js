const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//user Schema

var AdminModel = mongoose.Schema({
     fullname: 
     {
          type: String,
          index: true,
     },
     username:
     {
          type: String,
     },
     role:
     {
          type: String,
     },
     password:
     {
          type: String,
     },
}); 

var Admin = module.exports = mongoose.model('Admin',AdminModel);


module.exports.getUserByUsername = (username,callback) => {
     var query = {username: username};
     Admin.findOne(query,callback);
}

module.exports.getUserById = (id,callback) => {
     Admin.findById(id,callback);
}

module.exports.comparePassword = (candidatePassword,hash,callback) => {
     bcrypt.compare(candidatePassword,hash,
          (err,isMatch) => {
               if(err) throw err;
               callback(null,isMatch);
          });
}