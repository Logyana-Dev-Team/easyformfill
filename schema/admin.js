var mongoose = require('mongoose');
var Schema = mongoose.Schema,

ObjectId = Schema.ObjectId;

var mylogin = new Schema({
    user_uname :String,
    user_pswd :String
    });
    module.exports = mongoose.model('login', mylogin);