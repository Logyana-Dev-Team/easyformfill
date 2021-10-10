var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var myuser = new Schema({
    uname:String,
    uaddress: String,
    date: String,
    mobile: String
});

module.exports = mongoose.model('letter', myuser);