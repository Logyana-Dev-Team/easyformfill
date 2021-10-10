
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var myuser = new Schema({
user_name :String,
user_email :String,
user_mobile :String,
user_enquiry: String
});

module.exports = mongoose.model('users', myuser);

// var mylogin = new Schema({
//     user_uname :String,
//     user_pswd :String
//     });
    
//     module.exports = mongoose.model('users', mylogin);
    