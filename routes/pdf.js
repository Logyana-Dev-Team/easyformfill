var express    = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var cookieParser = require('cookie-parser');
var pdf        = require('html-pdf');
var fs         = require('fs');
var options    = {format:'A4'};
var exphbs  = require('express-handlebars');

var path = require('path')



//init app
var router = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(cookieParser());
//set template engine
router.engine('.handlebars', exphbs({
    extname: '.handlebars',
    // partialsDir: path.join(__dirname, 'views'),
    layoutsDir: path.join(__dirname, 'views')
  }));
  router.set('view engine', '.handlebars');
  router.set('views',path.join(__dirname,'views'))

//fetch data from the request
router.use(bodyParser.urlencoded({extended:false}));

router.get('/main',(req,res)=>{
    res.render('main')
});
router.get('/wireman-exampdf',(req,res)=>{
    res.render('wireman-exampdf')
});

router.post('/',(req,res)=>{
    res.render('main',{data:req.body.article},function(err,html){
        pdf.create(html, options).toFile('./public/uploads/demopdf.pdf', function(err, result) {
            if (err){
                return console.log(err);
            }
             else{
            console.log(res);
            var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
            res.header('content-type','application/pdf');
            res.send(datafile);
             }
          });
    })
})

router.post('/',(req,res)=>{
    res.render('wireman-exampdf',{data:req.body.article},function(err,html){
        pdf.create(html, options).toFile('./public/uploads/demopdf.pdf', function(err, result) {
            if (err){
                return console.log(err);
            }
             else{
            console.log(res);
            var datafile = fs.readFileSync('./public/uploads/demopdf.pdf');
            res.header('content-type','application/pdf');
            res.send(datafile);
             }
          });
    })
})

module.exports = router;

