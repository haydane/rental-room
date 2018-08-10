const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//user Schema

var UserSchema = mongoose.Schema({
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
          default: "user"
     },
     password:
     {
          type: String,
     },
}); 

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = (newUser, callback) => {
     bcrypt.genSalt(10,(err, salt) => {
          bcrypt.hash(newUser.password, salt, (err,hash) => {
               newUser.password = hash;
               newUser.save(callback);
          });
     });
}

module.exports.getUserByUsername = (username,callback) => {
     var query = {username: username};
     User.findOne(query,callback);
}

module.exports.getUserById = (id,callback) => {
     User.findById(id,callback);
}

module.exports.comparePassword = (candidatePassword,hash,callback) => {
     bcrypt.compare(candidatePassword,hash,
          (err,isMatch) => {
               if(err) throw err;
               callback(null,isMatch);
          });
}