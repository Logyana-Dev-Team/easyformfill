var createError = require('http-errors');
var UsersModel = require('./schema/user');
var express = require('express');
var path = require('path');
var Razorpay  = require('razorpay')
var shortid  = require('shortid')

var pdf        = require('html-pdf');
var options    = {format:'A4'};
googleInputTool = require('google-input-tool');
var cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8081
var logger = require('morgan');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const bodyParser = require("body-parser");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('req-flash');
var cors = require('cors')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)
const dotenv = require('dotenv')
// var pdf = require('html-pdf');

var nodemailer = require('nodemailer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var pdfRouter = require('./routes/pdf');

var app = express();

app.use(cors())
 

const razorpay = new Razorpay({
	key_id: 'rzp_test_pRgWB6EHkORwTO',
	key_secret: 'WmGEf5jgj8tFTdI0ohILLSDY'
})

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.handlebars'}));
app.set('view engine', 'handlebars');
 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600000, //1 hour
    },
  }));

 
  app.use(flash());
  app.use(passport.initialize());
app.use(passport.session());
 
 // Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Db Connection Start 
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://easyformfillmongodb:easyform@easyformfillcluster.hnn4q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true ,useUnifiedTopology: true })
.then(() => console.log('connection successful'))
.catch((err) => console.error(err))

//mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });
//State  0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
//console.log(mongoose.connection.readyState);
//DB Connection End

app.use('/index', indexRouter);
app.use('/', usersRouter);
// app.use('/', pdfRouter);
 

//user login and registration
const userSchema = new mongoose.Schema({
  uname: String,
  fname: String,
  uaddress:String,
  mobile:Number,
  email:String,
  adharno:String,
  age: Number,
  dob:String,
  username:String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use("local", User.createStrategy());


app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.post(
  "/register",

  function (req, res) {
    console.log(req.body)
   
    User.register(
      {
        uname: req.body.uname,
        fname: req.body.fname,
        uaddress: req.body.uaddress,
        email:req.body.email,
        mobile: req.body.mobile,
        adharno:req.body.adharno,
        age: req.body.age,
        dob:req.body.dob,
        username:req.body.username
      },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/login");
        }
      }
    );
  }
);


// app.post(
//   "/login",
//   [
//     passport.authenticate("local", {
//       failureRedirect: "/",
//       failureFlash: true,
//     }),
//   ],
//   function (req, res) {
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password,
//     });
//     try {
//       req.login(user, function (err) {
//         passport.authenticate("local")(req, res, function () {
//           res.redirect(req.get("referer"));
//         });
//       });
//     } catch (err) {
//       console.log(err);
//       req.flash("error", err.message);
//       res.redirect("/");
//     }
//   }
// );
app.get('/login', function(req, res, next) {
  //     // res.render('add-form');
      res.render('login');
  });
  app.get('/input-tool', function(req, res, next) {
    //     // res.render('add-form');
        res.render('input-tool');
    });
app.post("/login",[passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
  ],
  function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    try {
      req.login(user, function (err) {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/home");
          console.log("login successfull")
        });
      });
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect(req.get("referer"));
    }
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.get('/wireman',(req, res)=>{
  res.send("hello word")
})


app.get('/wiremansuitletter', function(req, res) {
  // res.render('wireman-suit-exam/letter')
  res.send('hello letter')
});
app.get('/wireman-suit-namuna12m', function(req, res, next) {
  // res.render('login-form');
  res.send('hello namuna12m')
  // res.render('wireman-suit-exam/namuna-12m')
})
// app.get('/wireman-suit-namunac', function(req, res, next) {
//   // res.render('login-form');
//   res.render('wireman-suit-exam/namuna-c')
// })
// app.get('/wirema-suit-namunae', function(req, res, next) {
//   // res.render('login-form');
//   res.render('wireman-suit-exam/namuna-e')
// })
// app.get('/wireman-suit-prapatrab', function(req, res, next) {
//   // res.render('login-form');
//   res.render('wireman-suit-exam/prapatra-b')
// })
// app.get('/wireman-suit-photo', function(req, res, next) {
//   // res.render('login-form');
//   res.render('wireman-suit-exam/photo-format')
// })

/*  GENERATE PDF USING  */
//set template engine
// app.engine('.handlebars', exphbs({
//   extname: '.handlebars',
//   // partialsDir: path.join(__dirname, 'views'),
//   layoutsDir: path.join(__dirname, 'views')
// }));
// app.set('view engine', '.handlebars');
// app.set('views',path.join(__dirname,'views'))

// //fetch data from the request
// app.use(bodyParser.urlencoded({extended:false}));

// app.get('/',(req,res)=>{
//   res.render('main')
// });
// app.get('/wireman',(req,res)=>{
//   res.render('wireman-exampdf')
// });

// app.post('/',(req,res)=>{
//   res.render('main',{data:req.body.article},function(err,html){
//       pdf.create(html, options).toFile('./public/uploads/demopdf.pdf', function(err, result) {
//           if (err){
//               return console.log(err);
//           }
//            else{
//           console.log(res);
//           var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
//           res.header('content-type','application/pdf');
//           res.send(datafile);
//            }
//         });
//   })
// })

// app.post('/',(req,res)=>{
//   res.render('wireman-exam',{data:req.body.article},function(err,html){
//       pdf.create(html, options).toFile('./public/uploads/demopdf.pdf', function(err, result) {
//           if (err){
//               return console.log(err);
//           }
//            else{
//           console.log(res);
//           var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
//           res.header('content-type','application/pdf');
//           res.send(datafile);
//            }
//         });
//   })
// })




// app.get("/wireman-exampdf",async (req, res) => {
//   const user= await UsersModel.findById(req.user.id,{}).lean();
    
//   // res.render('generatePDF',{user:user})
//   ejs.renderFile(path.join(__dirname, './views/', "wireman-exampdf"), {user:user}, (err, data) => {
//   if (err) {
//         res.send(err);
//   } else {
//       let options = {
//           "height": "11.25in",
//           "width": "8.5in",
//           "header": {
//               "height": "20mm"
//           },
//           "footer": {
//               "height": "20mm",
//           },
//       };
//       pdf.create(data, options).toFile("report.pdf", function (err, data) {
//           if (err) {
//               res.send(err);
//           } else {
//               res.send("File created successfully");
//           }
//       });
//   }
// });
// })

app.get('/generatePDF',async function(req, res, next) {
  const user= await UsersModel.findById(req.user.id,{}).lean();
  // console.log(user)
  
  res.render('generatePDF',{user:user})
})


//RAYZORPAY PAYMENT GATEWAY
app.post("/verification", function (req, res) {
  // do a validation
  const secret = "12345678";

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
  } else {
    console.log("request is not legit");
  }
  res.json({ status: "ok" });
  res.redirect("/checkout-review");
});

app.post("/razorpay", async (req, res) => {
  const user = await User.findById(req.user.id, {});
  var total = user.totalPrice.reduce((acc, item) => {
    return item;
  }, 0);
  const payment_capture = 1;
  const amount = total.totalPrice;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});





app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
module.exports = app;
