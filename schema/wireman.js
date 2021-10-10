var mongoose = require('mongoose');
var Schema = mongoose.Schema,

ObjectId = Schema.ObjectId;

var wiremanexam = new Schema({
    // index
    uname :String,
    city1 :String,
    city2:String,
    city3:String,
    //lettr
    uaddress :String,
    mobile:String,
    date:String,
    //namunae12
    // uname: req.body.uname,
    fname:String,
    // uaddress: req.body.uaddress,
    dob:String ,
    dobplace:String,
    education:String ,
    experience:String ,
    height: String,
    symbol:String ,
    //namunae
    // uname: req.body.uname,
    designation: String,
    joiningdate: String,
    livingdate: String,
    supervisorname:String,
    companyname:String,
    // date:req.body.companyname
    //prapatra
    // uname: String,
    // fname: String,
    age: String,
    year: String,
    occupation: String,
    adharno:String,
    // uaddress:String
    });
    module.exports = mongoose.model('wireman', wiremanexam);

 

// var letter = new Schema({
//     uname :String,
//     uaddress :String,
//     mobile:String,
//     date:String,
//     });
//     module.exports = mongoose.model('letter', letter);
