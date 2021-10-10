var express = require("express");
//generatePDF
let pdf = require("html-pdf");
var router = express.Router();
let ejs = require("ejs");
let path = require("path");
var exphbs = require("express-handlebars");
var UsersModel = require("../schema/user");
var AdminModel = require("../schema/admin");
var Wireman = require("../schema/wireman");
var Response = require("../response");
var nodemailer = require("nodemailer");
var request = require("request");
var url = require("url");

var Razorpay = require("razorpay");
var shortid = require("shortid");

const PDFDocument = require("pdfkit");
const fs = require("fs");
// const Notifier = require('./notifier');

//List Table Data
// router.get('/', function(req, res) {
//             if(isAuthenticated){
//               res.render('index',{currentUser:req.user});
//             }
//             else{
//               res.render('login');
//             }

// });

// router.get('/', function(req, res) {
//   if(isAuthenticated){
//     res.render('index',{currentUser:req.user});
//   }
//   else{
//     res.render('login');
//   }

// });

// router.get('/', function(req, res) {

//     res.render('index');

// });
router.get("/", async function (req, res, next) {
  // const product = await Product.find({}).explain("executionStats");
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("home", { user: user });
  } else {
    res.render("index");
  }
});
//List Table Data
router.get("/display", function (req, res) {
  UsersModel.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("display-table", { users: users });
      console.log(users);
    }
  });
});

//Wireman Pages
router.get("/form1", function (req, res, next) {
  // res.render('add-form');
  res.send("hello world");
});

//SIGNUP FORM
router.get("/register", function (req, res, next) {
  // res.render('add-form');
  res.render("register");
});

//Login FORM
// router.get('/login', function(req, res, next) {
//     // res.render('add-form');
//     res.render('login');
// });
//Display Form
router.get("/add", function (req, res, next) {
  res.render("add-form");
});

router.get("/home", async function (req, res, next) {
  // const product = await Product.find({}).explain("executionStats");
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("index", { user: user });
  } else {
    res.render("index");
  }
});

router.get("/wireman-exam", async function (req, res, next) {
  // const product = await Product.find({}).explain("executionStats");
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/wireman", { user: user });
  } else {
    res.render("login");
  }
});

router.get("/supervisor-exam", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/supervisor", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-exam/supervisor');
});
router.get("/wireman-suit-exam", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/wireman-suit", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-suit-exam/wireman-suit');
});

router.get("/supervisor-suit-exam", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/supervisor-suit", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-suit-exam?/supervisor-suit');
});

router.get("/wireman-supervisor-reexam", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/wiremansupervisorRexam", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wiremansuperwiserRexam/wiremansupervisorRexam');
});

router.get("/new-contractor-licence", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/newContractorLicence", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/newContractorLicence');
});

router.get("/contractor-licence-renewal", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/contractorLicenceRenewal", {
      user: user,
    });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/contractorLicenceRenewal');
});

/* GET SINGLE User BY ID */
router.get("/wireman-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/index", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-exam/index',{user:user})
});
router.get("/supervisor-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/index", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-exam/index',{user:user})
});

router.get("/new-contractor-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/index", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/index',{user:user})
});

router.post("/new-contractor-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },

    {
      city1: req.body.city1,
      city2: req.body.city2,
      city3: req.body.city3,
      city4: req.body.city4,
      firmName: req.body.firmName,
      supervisorLicenseNo: req.body.supervisorLicenseNo,
      supervisorLicenseDate: req.body.supervisorLicenseDate,
      supervisorName: req.body.supervisorName,
      ownerName: req.body.ownerName,
      megarMake: req.body.megarMake,
      megarNo: req.body.megarNo,
      earthTesterMake: req.body.earthTesterMake,
      earthTesterNo: req.body.earthTesterNo,
      chalanNo: req.body.chalanNo,
      chalanDate: req.body.chalanDate,
      megarReceiptNo: req.body.megarReceiptNo,
      megarReceiptDate: req.body.megarReceiptDate,
      earthTesterReceiptNo: req.body.earthTesterReceiptNo,
      earthTesterReceiptDate: req.body.earthTesterReceiptDate,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-index2");
      }
    }
  );
  // res.redirect('../new-contractor-index2');
});

router.get("/new-contractor-index2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/index2", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/index2',{user:user})
});

router.post("/new-contractor-index2", function (req, res, next) {
  res.redirect("../new-contractor-letter");
});

router.get("/new-contractor-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/letter", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/letter',{user:user})
});

router.post("/new-contractor-letter", function (req, res, next) {
  // console.log(req.body);

  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunan");
      }
    }
  );
});

router.get("/new-contractor-namunan", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-n", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-n',{user:user})
});

router.post("/new-contractor-namunan", function (req, res, next) {
  console.log(req.body.ifpartnerAddress);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      firmAddress: req.body.firmAddress,
      ownerMobile: req.body.ownerMobile,
      ownerEmail: req.body.ownerEmail,
      partnership: req.body.partnership,
      ownerDob: req.body.ownerDob,
      ownerAge: req.body.ownerAge,
      ownerFname: req.body.ownerFname,
      ownerEducation: req.body.ownerEducation,
      partnerName: req.body.partnerName,
      partnerAddress: req.body.partnerAddress,
      bankName: req.body.bankName,
      accountNo: req.body.accountNo,
      balance: req.body.balance,
      previousLicenseNo: req.body.previousLicenseNo,
      licenseValidity: req.body.licenseValidity,
      workDetails: req.body.workDetails,
      reason: req.body.reason,
      shopName: req.body.shopName,
      billNo: req.body.billNo,
      billDate: req.body.billDate,
      place: req.body.place,
      ownerAddress: req.body.ownerAddress,
      ifpartnerName: req.body.ifpartnerName,
      ifpartnerAddress: req.body.ifpartnerAddress,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunas");
      }
    }
  );
});

//  instituteName: req.user.instituteName,
// instituteAddress: req.user.instituteAddress,
// partnership: req.user.partnership,
// education: req.user.education,
// bankDetails: req.user.bankDetails,
// shopName: req.user.shopName,
// billNo: req.user.billNo,
// billDate: req.user.billDate,
// place:req.user.place
router.get("/new-contractor-namunas", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-s", { user: user });
  } else {
    res.render("login");
  }

  // res.render('new-contractor-licence/namuna-s',{user:user})
});

router.post("/new-contractor-namunas", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      sanctionDate: req.body.sanctionDate,
      megarRenewalPeriod: req.body.megarRenewalPeriod,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunat");
      }
    }
  );
});

router.get("/new-contractor-namunat", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-t", { user: user });
  } else {
    res.render("login");
  }

  // res.render('new-contractor-licence/namuna-t',{user:user})
});

router.post("/new-contractor-namunat", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      earthTesterRenewalPeriod: req.body.earthTesterRenewalPeriod,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunau");
      }
    }
  );
});
router.get("/new-contractor-namunau", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-u", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-u',{user:user})
});

router.post("/new-contractor-namunau", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      supervisorAddress: req.body.supervisorAddress,
      supervisorMobile: req.body.supervisorMobile,
      supervisorEmail: req.body.supervisorEmail,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunau2");
      }
    }
  );
});
router.get("/new-contractor-namunau2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-u2", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-u2',{user:user})
});

router.post("/new-contractor-namunau2", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      partnerName: req.body.partnerName,
      partnerAddress: req.body.partnerAddress,
      partnerEmail: req.body.partnerEmail,
      partnerMobile: req.body.partnerMobile,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunax");
      }
    }
  );
  // res.redirect('../new-contractor-namunax');
});

router.get("/new-contractor-namunax", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-x", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-x',{user:user})
});

router.post("/new-contractor-namunax", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      lastFirm: req.body.lastFirm,
      lastFirmAddress: req.body.lastFirmAddress,
      lastFirmNo: req.body.lastFirmNo,
      firmPeriodFrom: req.body.firmPeriodFrom,
      firmPeriodTo: req.body.firmPeriodTo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunaz");
      }
    }
  );
});
router.get("/new-contractor-namunaz", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-z", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-z',{user:user})
});

router.post("/new-contractor-namunaz", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      supervisorAge: req.body.supervisorAge,
      supervisorAdharNo: req.body.supervisorAdharNo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-namunav");
      }
    }
  );
});

router.get("/new-contractor-namunav", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-v", { user: user });
  } else {
    res.render("login");
  }

  // res.render('new-contractor-licence/namuna-v',{user:user})
});

router.post("/new-contractor-namunav", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../new-contractor-namunaw");
});

router.get("/new-contractor-namunaw", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-w", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-w',{user:user})
});

router.post("/new-contractor-namunaw", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../new-contractor-namunay");
});
router.get("/new-contractor-namunay", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/namuna-y", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/namuna-y',{user:user})
});

router.post("/new-contractor-namunay", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../new-contractor-prapatrab");
});

router.get("/new-contractor-prapatrab", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/prapatra-b", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/prapatra-b',{user:user})
});

router.post("/new-contractor-prapatrab", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      ownerName: req.body.ownerName,
      ownerFname: req.body.ownerFname,

      ownerOccupation: req.body.ownerOccupation,
      ownerAdharNo: req.body.ownerAdharNo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-prapatrab2");
      }
    }
  );
  // res.redirect('../new-contractor-prapatrab2');
});

router.get("/new-contractor-prapatrab2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/prapatra-b2", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/prapatra-b2',{user:user})
});

router.post("/new-contractor-prapatrab2", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      supervisorName: req.body.supervisorName,
      supervisorFname: req.body.supervisorFname,
      supervisorOccupation: req.body.supervisorOccupation,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../new-contractor-photo");
      }
    }
  );
  // res.redirect('../new-contractor-photo');
});

router.get("/new-contractor-photo", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("new-contractor-licence/photo-format", { user: user });
  } else {
    res.render("login");
  }
  // res.render('new-contractor-licence/photo-format',{user:user})
});

router.post("/new-contractor-photo", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../new-contractorPdf");
});

//license renewal

router.get("/contractor-licenceRenewal-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/index", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/index',{user:user})
});

router.post("/contractor-licenceRenewal-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      firmName: req.body.firmName,
      firmRegNo: req.body.firmRegNo,
      licensePeriodFrom: req.body.licensePeriodFrom,
      licensePeriodTo: req.body.licensePeriodTo,
      city1: req.body.city1,
      city2: req.body.city2,
      city3: req.body.city3,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-index2");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-letter');
});

router.get("/contractor-licenceRenewal-index2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/index2", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/index2',{user:user})
});

router.post("/contractor-licenceRenewal-index2", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      firmName: req.body.firmName,
      firmRegNo: req.body.firmRegNo,
      licensePeriodFrom: req.body.licensePeriodFrom,
      licensePeriodTo: req.body.licensePeriodTo,
      city1: req.body.city1,
      city2: req.body.city2,
      city3: req.body.city3,
      city3: req.body.city4,
      city3: req.body.city5,
      city3: req.body.city6,
      city3: req.body.city7,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-letter");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-letter');
});

router.get("/contractor-licenceRenewal-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/letter", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/letter',{user:user})
});

router.post("/contractor-licenceRenewal-letter", function (req, res, next) {
  // console.log(req.body);

  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      date: req.body.date,
      office_city: req.body.office_city,
      licensePeriod: req.body.licensePeriod,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunas");
      }
    }
  );
});

router.get("/contractor-licenceRenewal-namunan", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-n", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-n',{user:user})
});

router.post("/contractor-licenceRenewal-namunan", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      date: req.body.date,
      office_city: req.body.office_city,
      licensePeriod: req.body.licensePeriod,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunas");
      }
    }
  );
  res.redirect("../contractor-licenceRenewal-namunas");
});

router.get("/contractor-licenceRenewal-namunas", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-s", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-s',{user:user})
});

router.post("/contractor-licenceRenewal-namunas", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      ownerName: req.body.ownerName,
      supervisorName: req.body.supervisorName,
      supervisorLicenseNo: req.body.supervisorLicenseNo,
      supervisorLicenseDate: req.body.supervisorLicenseDate,
      megarRenewalPeriod: req.body.megarRenewalPeriod,
      place: req.body.place,
      megarMake: req.body.megarMake,
      megarNo: req.body.megarNo,
      sanctionDate: req.body.sanctionDate,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunat");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunat');
});

router.get("/contractor-licenceRenewal-namunat", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-t", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/namuna-t',{user:user})
});

router.post("/contractor-licenceRenewal-namunat", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      earthTesterRenewalPeriod: req.body.earthTesterRenewalPeriod,

      earthTesterMake: req.body.earthTesterMake,
      earthTesterNo: req.body.earthTesterNo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunau");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunau');
});
router.get("/contractor-licenceRenewal-namunau", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-u", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/namuna-u',{user:user})
});

router.post("/contractor-licenceRenewal-namunau", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      sanctionDate: req.body.sanctionDate,

      firmAddress: req.body.firmAddress,
      ownerAddress: req.body.ownerAddress,
      ownerEmail: req.body.ownerEmail,
      ownerMobile: req.body.ownerMobile,
      supervisorAddress: req.body.supervisorAddress,
      supervisorEmail: req.body.supervisorEmail,
      supervisorMobile: req.body.supervisorMobile,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunau2");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunax');
});

router.get("/contractor-licenceRenewal-namunau2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-u2", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/namuna-u2',{user:user})
});

router.post("/contractor-licenceRenewal-namunau2", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      partnerName: req.body.partnerName,
      partnerAddress: req.body.partnerAddress,
      partnerEmail: req.body.partnerEmail,
      partnerMobile: req.body.partnerMobile,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunax");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunax');
});

router.get("/contractor-licenceRenewal-namunax", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-x", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-x',{user:user})
});

router.post("/contractor-licenceRenewal-namunax", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      lastFirm: req.body.lastFirm,
      lastFirmAddress: req.body.lastFirmAddress,
      lastFirmNo: req.body.lastFirmNo,
      firmPeriodFrom: req.body.firmPeriodFrom,
      firmPeriodTo: req.body.firmPeriodTo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunav");
      }
    }
  );
});

router.get("/contractor-licenceRenewal-namunaz", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-z", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-z',{user:user})
});

router.post("/contractor-licenceRenewal-namunaz", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      supervisorAge: req.body.supervisorAge,
      supervisorAdharNo: req.body.supervisorAdharNo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunav");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunav');
});

router.get("/contractor-licenceRenewal-namunav", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-v", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/namuna-v',{user:user})
});

router.post("/contractor-licenceRenewal-namunav", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../contractor-licenceRenewal-namunaw");
});

router.get("/contractor-licenceRenewal-namunaw", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-w", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/namuna-w',{user:user})
});

router.post("/contractor-licenceRenewal-namunaw", function (req, res, next) {
  // console.log(req.body);
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      ownerAge: req.body.ownerAge,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-namunay");
      }
    }
  );
  // res.redirect('../contractor-licenceRenewal-namunay');
});
router.get("/contractor-licenceRenewal-namunay", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-y", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-y',{user:user})
});

router.post("/contractor-licenceRenewal-namunay", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../contractor-licenceRenewal-namunaq");
});

router.get("/contractor-licenceRenewal-namunaq", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/namuna-q", { user: user });
  } else {
    res.render("login");
  }
  // res.render('contractor-licence-renewal/namuna-q',{user:user})
});

router.post("/contractor-licenceRenewal-namunaq", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      workStartDate: req.body.workStartDate,
      workEndDate: req.body.workEndDate,
      wiremanName: req.body.wiremanName,
      reportDate: req.body.reportDate,
      supplyCompanyName: req.body.supplyCompanyName,
      powerSupplyDate: req.body.powerSupplyDate,
      powerSupplyPerson: req.body.powerSupplyPerson,
      powerSupplyNo: req.body.powerSupplyNo,
      shera: req.body.shera,

      district: req.body.district,

      customerName1: req.body.customerName1,
      customerAddress1: req.body.customerAddress1,
      workStartDate1: req.body.workStartDate1,
      workEndDate1: req.body.workEndDate1,
      wiremanName1: req.body.wiremanName1,
      reportDate1: req.body.reportDate1,
      supplyCompanyName1: req.body.supplyCompanyName1,
      powerSupplyDate1: req.body.powerSupplyDate1,
      powerSupplyPerson1: req.body.powerSupplyPerson1,
      powerSupplyNo1: req.body.powerSupplyNo1,
      shera1: req.body.shera1,

      customerName2: req.body.customerName2,
      customerAddress2: req.body.customerAddress2,
      workStartDate2: req.body.workStartDate2,
      workEndDate2: req.body.workEndDate2,
      wiremanName2: req.body.wiremanName2,
      reportDate2: req.body.reportDate2,
      supplyCompanyName2: req.body.supplyCompanyName2,
      powerSupplyDate2: req.body.powerSupplyDate2,
      powerSupplyPerson2: req.body.powerSupplyPerson2,
      powerSupplyNo2: req.body.powerSupplyNo2,
      shera2: req.body.shera2,

      customerName3: req.body.customerName3,
      customerAddress3: req.body.customerAddress3,
      workStartDate3: req.body.workStartDate3,
      workEndDate3: req.body.workEndDate3,
      wiremanName3: req.body.wiremanName3,
      reportDate3: req.body.reportDate3,
      supplyCompanyName3: req.body.supplyCompanyName3,
      powerSupplyDate3: req.body.powerSupplyDate3,
      powerSupplyPerson3: req.body.powerSupplyPerson3,
      powerSupplyNo3: req.body.powerSupplyNo3,
      shera3: req.body.shera3,

      customerName4: req.body.customerName4,
      customerAddress4: req.body.customerAddress4,
      workStartDate4: req.body.workStartDate4,
      workEndDate4: req.body.workEndDate4,
      wiremanName4: req.body.wiremanName4,
      reportDate4: req.body.reportDate4,
      supplyCompanyName4: req.body.supplyCompanyName4,
      powerSupplyDate4: req.body.powerSupplyDate4,
      powerSupplyPerson4: req.body.powerSupplyPerson4,
      powerSupplyNo4: req.body.powerSupplyNo4,
      shera4: req.body.shera4,

      customerName5: req.body.customerName5,
      customerAddress5: req.body.customerAddress5,
      workStartDate5: req.body.workStartDate5,
      workEndDate5: req.body.workEndDate5,
      wiremanName5: req.body.wiremanName5,
      reportDate5: req.body.reportDate5,
      supplyCompanyName5: req.body.supplyCompanyName5,
      powerSupplyDate5: req.body.powerSupplyDate5,
      powerSupplyPerson5: req.body.powerSupplyPerson5,
      powerSupplyNo5: req.body.powerSupplyNo5,
      shera5: req.body.shera5,

      customerName6: req.body.customerName6,
      customerAddress6: req.body.customerAddress6,
      workStartDate6: req.body.workStartDate6,
      workEndDate6: req.body.workEndDate6,
      wiremanName6: req.body.wiremanName6,
      reportDate6: req.body.reportDate6,
      supplyCompanyName6: req.body.supplyCompanyName6,
      powerSupplyDate6: req.body.powerSupplyDate6,
      powerSupplyPerson6: req.body.powerSupplyPerson6,
      powerSupplyNo6: req.body.powerSupplyNo6,
      shera6: req.body.shera6,

      customerName7: req.body.customerName7,
      customerAddress7: req.body.customerAddress7,
      workStartDate7: req.body.workStartDate7,
      workEndDate7: req.body.workEndDate7,
      wiremanName7: req.body.wiremanName7,
      reportDate7: req.body.reportDate7,
      supplyCompanyName7: req.body.supplyCompanyName7,
      powerSupplyDate7: req.body.powerSupplyDate7,
      powerSupplyPerson7: req.body.powerSupplyPerson7,
      powerSupplyNo7: req.body.powerSupplyNo7,
      shera7: req.body.shera7,

      customerName8: req.body.customerName8,
      customerAddress8: req.body.customerAddress8,
      workStartDate8: req.body.workStartDate8,
      workEndDate8: req.body.workEndDate8,
      wiremanName8: req.body.wiremanName8,
      reportDate8: req.body.reportDate8,
      supplyCompanyName8: req.body.supplyCompanyName8,
      powerSupplyDate8: req.body.powerSupplyDate8,
      powerSupplyPerson8: req.body.powerSupplyPerson8,
      powerSupplyNo8: req.body.powerSupplyNo8,
      shera8: req.body.shera8,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-prapatrab");
      }
    }
  );

  // res.redirect('../contractor-licenceRenewal-prapatrab');
});
router.get("/contractor-licenceRenewal-prapatrab", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/prapatra-b", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/prapatra-b',{user:user})
});

router.post("/contractor-licenceRenewal-prapatrab", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      ownerName: req.body.ownerName,
      ownerFname: req.body.ownerFname,

      ownerOccupation: req.body.ownerOccupation,
      ownerAdharNo: req.body.ownerAdharNo,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-prapatrab2");
      }
    }
  );
});

router.get("/contractor-licenceRenewal-prapatrab2", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/prapatra-b2", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/prapatra-b2',{user:user})
});

router.post("/contractor-licenceRenewal-prapatrab2", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      supervisorName: req.body.supervisorName,
      supervisorFname: req.body.supervisorFname,
      supervisorOccupation: req.body.supervisorOccupation,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../contractor-licenceRenewal-photo");
      }
    }
  );
});

router.get("/contractor-licenceRenewal-photo", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("contractor-licence-renewal/photo-format", { user: user });
  } else {
    res.render("login");
  }

  // res.render('contractor-licence-renewal/photo-format',{user:user})
});

router.post("/contractor-licenceRenewal-photo", function (req, res, next) {
  // console.log(req.body);

  res.redirect("../contractorlicense-renewalPdf");
});

router.get("/wireman-suit-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/index", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-suit-exam/index',{user:user})
});

router.get("/wireman-suit-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/letter", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-suit-exam/letter',{user:user})
});
router.post("/wireman-suit-letter", function (req, res) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-suit-namunab1");
      }
    }
  );
});

router.get("/wireman-suit-namuna12m", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/namuna-12m", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-suit-exam/namuna-12m',{user:user})
});

router.post("/wireman-suit-namuna12m", function (req, res) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      dobplace: req.body.dobplace,
      height: req.body.height,
      symbol: req.body.symbol,
      color: req.body.color,
      period: req.body.period,
      examname: req.body.examname,
    },

    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-suit-prapatrab");
      }
    }
  );
});

router.get("/supervisor-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/letter", { user: user });
  } else {
    res.render("login");
  }

  //  res.render('wireman-exam/letter',{user:user})
});

router.get("/wireman-suit-namunab1", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/namuna-b1", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-suit-exam/namuna-b1',{user:user})
});
router.post("/wireman-suit-namunab1", function (req, res) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      education: req.body.education,
      duration: req.body.duration,
      institutename: req.body.institutename,
      state: req.body.state,
      place: req.body.place,
      chalanno: req.body.chalanno,
      chalandate: req.body.chalandate,
      occupation: req.body.occupation,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-suit-namuna12m");
      }
    }
  );
});
// List Table Data
router.get("/wireman-letter/", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/letter", { user: user });
  } else {
    res.render("login");
  }
  //  res.render('wireman-exam/letter',{user:user})
});

router.get("/wireman-letter/:id", function (req, res) {});

router.get("/wireman-namuna12m", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/namuna-12m", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-exam/namuna-12m',{user:user})
});
router.get("/wireman-namunac", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/namuna-c", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-exam/namuna-c',{user:user})
  // res.render('login-form');
});
router.post("/wireman-namunac", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      companyname: req.body.companyname,
      chalanplace: req.body.chalanplace,
      chalandate: req.body.chalandate,
      occupation: req.body.occupation,
      education: req.body.education,
      period: req.body.period,
      chalanno: req.body.chalanno,
      rupee: req.body.rupee,
      place: req.body.place,
      language: req.body.language,
      examcenter: req.body.examcenter,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-namunae");
      }
    }
  );
});
router.get("/supervisor-namunac", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/namuna-c", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-exam/namuna-c',{user:user})
  // res.render('login-form');
});
router.post("/supervisor-namunac", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      companyname: req.body.companyname,
      chalanplace: req.body.chalanplace,
      chalandate: req.body.chalandate,
      occupation: req.body.occupation,
      education: req.body.education,
      period: req.body.period,
      chalanno: req.body.chalanno,
      rupee: req.body.rupee,
      place: req.body.place,
      language: req.body.language,
      examcenter: req.body.examcenter,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-namunae");
      }
    }
  );
});
router.get("/wireman-namunae", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/namuna-e", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-exam/namuna-e',{user:user})
});
router.get("/supervisor-namunae", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/namuna-e", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-exam/namuna-e',{user:user})
});
router.get("/wireman-suit-namunae", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/namuna-e", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-suit-exam/namuna-e',{user:user})
});
router.post("/wireman-suit-namunae", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      designation: req.body.designation,
      joiningdate: req.body.joiningdate,
      livingdate: req.body.livingdate,
      supervisorname: req.body.supervisorname,
      companyname: req.body.companyname,
      licenseno: req.body.licenseno,
      period: req.body.period,
      worktype: req.body.worktype,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-suit-namuna12m");
      }
    }
  );
});
router.get("/wireman-suit-prapatrab", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/prapatra-b", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-suit-exam/prapatra-b',{user:user})
});
router.post("/wireman-suit-prapatrab", function (req, res, next) {
  res.redirect("../wireman-suit-photo");
});
router.get("/wireman-suit-photo", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-suit-exam/photo-format", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wireman-suit-exam/photo-format',{user:user})
});
// router.post('/wireman-suit-photo', function(req, res, next) {
//     res.redirect('../wireman-suit-photo');
// })
router.get("/wireman-prapatrab", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/prapatra-b", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-exam/prapatra-b',{user:user})
});
router.get("/wireman-photo", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/photo-format", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-exam/photo-format',{user:user})
});
router.get("/wireman-translate", function (req, res, next) {
  // res.render('login-form');
  res.render("wireman-exam/translate");
});

router.get("/supervisor-namuna12m", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/namuna-12m", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-exam/namuna-12m',{user:user})
});
router.get("/supervisor-namunac", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/namuna-c", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-exam/namuna-c',{user:user})
});

router.post("/supervisor-namunae", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      designation: req.body.designation,
      joiningdate: req.body.joiningdate,
      livingdate: req.body.livingdate,
      supervisorname: req.body.supervisorname,
      licenseno: req.body.licenseno,
      worktype: req.body.worktype,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-namuna12m");
      }
    }
  );
});

router.get("/supervisor-prapatrab", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/prapatra-b", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-exam/prapatra-b',{user:user})
});
router.post("/supervisor-prapatrab", function (req, res, next) {
  res.redirect("../supervisor-photo");
});
router.get("/supervisor-photo", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-exam/photo-format", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-exam/photo-format',{user:user})
});

router.get("/supervisor-suit-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/index", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-suit-exam/index',{user:user})
});

router.post("/supervisor-suit-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { city1: req.body.city1, city2: req.body.city2, city3: req.body.city3 },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-suit-letter");
      }
    }
  );
});

router.get("/supervisor-suit-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/letter", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-suit-exam/letter',{user:user})
});

router.post("/supervisor-suit-letter", function (req, res, next) {
  // console.log(req.body);

  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-suit-namunaA");
      }
    }
  );
});

router.get("/supervisor-suit-namunaA", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/namuna-a", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-suit-exam/namuna-a',{user:user})
  // res.render('login-form');
});
router.post("/supervisor-suit-namunaA", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      companyname: req.body.companyname,
      chalanplace: req.body.chalanplace,
      chalandate: req.body.chalandate,
      occupation: req.body.occupation,
      education: req.body.education,
      period: req.body.period,
      chalanno: req.body.chalanno,
      rupee: req.body.rupee,
      place: req.body.place,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-suit-namunae");
      }
    }
  );
});

router.get("/wireman-namunae", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wireman-exam/namuna-e", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wireman-exam/namuna-e',{user:user})
});

router.get("/supervisor-suit-namunae", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/namuna-e", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-suit-exam/namuna-e',{user:user})
});

router.post("/supervisor-suit-namunae", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      designation: req.body.designation,
      joiningdate: req.body.joiningdate,
      livingdate: req.body.livingdate,
      supervisorname: req.body.supervisorname,
      licenseno: req.body.licenseno,
      worktype: req.body.worktype,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-suit-namuna12m");
      }
    }
  );
});

router.get("/supervisor-suit-namuna12m", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/namuna-12m", { user: user });
  } else {
    res.render("login");
  }
  // res.render('supervisor-suit-exam/namuna-12m',{user:user})
});

router.post("/supervisor-suit-namuna12m", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      dobplace: req.body.dobplace,
      height: req.body.height,
      symbol: req.body.symbol,
      color: req.body.color,
      lastexperience: req.body.lastexperience,
      lastplace: req.body.lastplace,
      examname: req.body.examname,
      experience: req.body.experience,
      examPeriod: req.body.examPeriod,
    },

    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-suit-prapatrab");
      }
    }
  );
});

router.get("/supervisor-suit-prapatrab", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/prapatra-b", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-suit-exam/prapatra-b',{user:user})
});

router.post("/supervisor-suit-prapatrab", function (req, res, next) {
  res.redirect("../supervisor-suit-photo");
});
router.get("/supervisor-suit-photo", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("supervisor-suit-exam/photo-format", { user: user });
  } else {
    res.render("login");
  }

  // res.render('supervisor-suit-exam/photo-format',{user:user})
});

router.get("/WSRexam-index", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/index", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/index',{user:user})
});
router.post("/WSRexam-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { city1: req.body.city1, city2: req.body.city2, city3: req.body.city3 },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../WSRexam-letter");
      }
    }
  );
});

router.get("/WSRexam-letter", async function (req, res) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/letter", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/letter',{user:user})
});
router.post("/WSRexam-letter", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../WSRexam-namunaD");
      }
    }
  );
});

router.get("/WSRexam-namunaD", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/namuna-d", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/namuna-d',{user:user})
  // res.render('login-form');
});

router.post("/WSRexam-namunaD", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      examdate: req.body.examdate,
      examplace: req.body.examplace,
      occupation: req.body.occupation,
      chalanno: req.body.chalanno,
      rupee: req.body.rupee,
      place: req.body.place,
      language: req.body.language,
      examcenter: req.body.examcenter,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../WSRexam-namuna12m");
      }
    }
  );
});

router.get("/WSRexam-namunae", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/namuna-e", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/namuna-e',{user:user})
});

router.post("/WSRexam-namunae", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      designation: req.body.designation,
      joiningdate: req.body.joiningdate,
      livingdate: req.body.livingdate,
      supervisorname: req.body.supervisorname,
      companyname: req.body.companyname,
      licenseno: req.body.licenseno,
      period: req.body.period,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../WSRexam-namuna12m");
      }
    }
  );
});
router.get("/WSRexam-namuna12m", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/namuna-12m", { user: user });
  } else {
    res.render("login");
  }
  // res.render('wiremansuperwiserRexam/namuna-12m',{user:user})
});

router.post("/WSRexam-namuna12m", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      seatno: req.body.seatno,
      examdate: req.body.examdate,
      examplace: req.body.examplace,
      examname: req.body.examname,
      dobplace: req.body.dobplace,
      height: req.body.height,
      color: req.body.color,
      symbol: req.body.symbol,
      companyname: req.body.companyname,
      period: req.body.period,
    },

    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../WSRexam-prapatrab");
      }
    }
  );
});
router.get("/WSRexam-prapatrab", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/prapatra-b", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/prapatra-b',{user:user})
});

router.post("/WSRexam-prapatrab", function (req, res, next) {
  res.redirect("../WSRexam-photo");
});
router.get("/WSRexam-photo", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("wiremansuperwiserRexam/photo-format", { user: user });
  } else {
    res.render("login");
  }

  // res.render('wiremansuperwiserRexam/photo-format',{user:user})
});

/* POST Data. */
router.post("/add", function (req, res, next) {
  console.log(req.body);

  const mybodydata = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile,
    user_enquiry: req.body.user_enquiry,
  };
  var data = UsersModel(mybodydata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("add-form", { message: "User registered not successfully!" });
    } else {
      res.render("add-form", { message: "User registered successfully!" });
    }
  });
});

router.post("/wireman-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      city1: req.body.city1,
      city2: req.body.city2,
      city4: req.body.city4,
      city3: req.body.city3,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-letter");
      }
    }
  );
});

router.post("/supervisor-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      city1: req.body.city1,
      city2: req.body.city2,
      city4: req.body.city4,
      city3: req.body.city3,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-letter");
      }
    }
  );
});
router.post("/wireman-suit-index", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      city1: req.body.city1,
      city2: req.body.city2,
      city4: req.body.city4,
      city3: req.body.city3,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-suit-letter");
      }
    }
  );
});
/* POST Data. */
router.post("/wireman-letter", function (req, res, next) {
  // console.log(req.body);

  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-namunac");
      }
    }
  );
});
router.post("/supervisor-letter", function (req, res, next) {
  // console.log(req.body);

  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    { date: req.body.date, office_city: req.body.office_city },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-namunac");
      }
    }
  );
});

router.post("/wireman-namuna12m", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      dobplace: req.body.dobplace,
      height: req.body.height,
      symbol: req.body.symbol,
      color: req.body.color,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-prapatrab");
      }
    }
  );
});

router.post("/supervisor-namuna12m", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      dobplace: req.body.dobplace,
      height: req.body.height,
      symbol: req.body.symbol,
      color: req.body.color,
      lastexperience: req.body.lastexperience,
      lastplace: req.body.lastplace,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../supervisor-prapatrab");
      }
    }
  );
});

router.post("/wireman-namunae", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      designation: req.body.designation,
      joiningdate: req.body.joiningdate,
      livingdate: req.body.livingdate,
      supervisorname: req.body.supervisorname,
      licenseno: req.body.licenseno,
      worktype: req.body.worktype,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../wireman-namuna12m");
      }
    }
  );
});
/* POST Data. */
router.post("/wireman-prapatrab", function (req, res, next) {
  res.redirect("../wireman-photo");
});
router.post("/wireman-photo", function (req, res, next) {
  // console.log(req.body);

  const mylogindata = {
    uname: req.body.user_uname,
    date: req.body.date,
    joiningdate: req.body.joiningdate,
    uaddress: req.body.uaddress,
  };
  var data = Wireman(mylogindata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("wireman-photo", {
        message: "User registered not successfully!",
      });
    } else {
      // req.flash('success_msg', 'Login Successful');
      res.redirect("../wireman-exampdf");
    }
  });
  function printForm() {
    $("a.printPage").click(function () {
      window.print();
      return false;
    });
  }
});

router.post("/wireman-suit-photo", function (req, res, next) {
  // console.log(req.body);

  const mylogindata = {
    uname: req.body.user_uname,
    date: req.body.date,
    joiningdate: req.body.joiningdate,
    uaddress: req.body.uaddress,
  };
  var data = Wireman(mylogindata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("wireman-photo", {
        message: "User registered not successfully!",
      });
    } else {
      // req.flash('success_msg', 'Login Successful');
      res.redirect("../wireman-suitpdf");
    }
  });
  function printForm() {
    $("a.printPage").click(function () {
      window.print();
      return false;
    });
  }
});

router.post("/supervisor-suit-photo", function (req, res, next) {
  // console.log(req.body);

  const mylogindata = {
    uname: req.body.user_uname,
    date: req.body.date,
    joiningdate: req.body.joiningdate,
    uaddress: req.body.uaddress,
  };
  var data = Wireman(mylogindata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("wireman-photo", {
        message: "User registered not successfully!",
      });
    } else {
      // req.flash('success_msg', 'Login Successful');
      res.redirect("../supervisor-suitpdf");
    }
  });

  function printForm() {
    $("a.printPage").click(function () {
      window.print();
      return false;
    });
  }
});

router.post("/supervisor-photo", function (req, res, next) {
  // console.log(req.body);

  const mylogindata = {
    uname: req.body.user_uname,
    date: req.body.date,
    joiningdate: req.body.joiningdate,
    uaddress: req.body.uaddress,
  };
  var data = Wireman(mylogindata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("supervisor-photo", {
        message: "User registered not successfully!",
      });
    } else {
      // req.flash('success_msg', 'Login Successful');
      res.redirect("../supervisor-exampdf");
    }
  });
  function printForm() {
    $("a.printPage").click(function () {
      window.print();
      return false;
    });
  }
});

router.post("/WSRexam-photo", function (req, res, next) {
  // console.log(req.body);

  const mylogindata = {
    uname: req.body.user_uname,
    date: req.body.date,
    joiningdate: req.body.joiningdate,
    uaddress: req.body.uaddress,
  };
  var data = Wireman(mylogindata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      res.render("wireman-photo", {
        message: "User registered not successfully!",
      });
    } else {
      // req.flash('success_msg', 'Login Successful');
      res.redirect("../WSRexam-pdf");
    }
  });
  function printForm() {
    $("a.printPage").click(function () {
      window.print();
      return false;
    });
  }
});

router.get("/profile", async function (req, res, next) {
  // const product = await Product.find({}).explain("executionStats");
  if (req.isAuthenticated()) {
    const user = await UsersModel.findById(req.user.id, {}).lean();
    res.render("profile", { user: user });
  } else {
    res.render("login");
  }
});

/*Profile*/

router.post("/profile", function (req, res, next) {
  UsersModel.findByIdAndUpdate(
    { _id: req.user.id },
    {
      uname: req.body.uname,
      fname: req.body.fname,
      uaddress: req.body.uaddress,
      email: req.body.email,
      mobile: req.body.mobile,
      adharno: req.body.adharno,
      age: req.body.age,
      dob: req.body.dob,
    },
    (err, item) => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
        res.redirect("../profile");
      }
    }
  );
});

// router.post('/profile/:id', function(req, res) {
//   UsersModel.findByIdAndUpdate(req.params.id, req.body, function(err) {
//       if (err) {
//           req.flash('error_msg', 'Something went wrong! User could not updated.');
//           res.redirect('edit/' + req.params.id);
//       } else {
//           req.flash('success_msg', 'Record Updated');
//           res.redirect('../display');
//       }
//   });
// });

/* DELETE User BY ID */
router.get("/delete/:id", function (req, res) {
  UsersModel.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
      req.flash("error_msg", "Record Not Deleted");
      res.redirect("../display");
    } else {
      req.flash("success_msg", "Record Deleted");
      res.redirect("../display");
    }
  });
});

/* GET SINGLE User BY ID */
router.get("/edit/:id", function (req, res) {
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);

      res.render("edit-form", { userDetail: user });
    }
  });
});

/* UPDATE User */
router.post("/edit/:id", function (req, res) {
  UsersModel.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash("error_msg", "Something went wrong! User could not updated.");
      res.redirect("edit/" + req.params.id);
    } else {
      req.flash("success_msg", "Record Updated");
      res.redirect("../display");
    }
  });
});

router.get("/get-all-users-api", function (req, res, next) {
  UsersModel.find({}, function (err, posts) {
    if (err) {
      Response.errorResponse(err, res);
    } else {
      Response.successResponse("User Listing!", res, posts);
    }
  });
});

router.post("/add-users-api", function (req, res, next) {
  console.log(req.body);

  const mybodydata = {
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile,
    user_enquiry: req.body.user_enquiry,
  };
  var data = UsersModel(mybodydata);
  //var data = UsersModel(req.body);
  data.save(function (err) {
    if (err) {
      Response.errorResponse(err, res);
    } else {
      Response.successResponse("User Added!", res, {});
    }
  });
});

/* GET SINGLE POST BY ID */
router.get("/get-users-details-api/:id", function (req, res, next) {
  UsersModel.findById(req.params.id, function (err, post) {
    if (err) {
      Response.errorResponse(err, res);
    } else {
      Response.successResponse("User Detail!", res, post);
    }
  });
});

/* DELETE POST BY ID */
router.delete("/delete-users-api", function (req, res, next) {
  UsersModel.findByIdAndRemove(req.body._id, function (err, post) {
    if (err) {
      Response.errorResponse(err, res);
    } else {
      Response.successResponse("User deleted!", res, {});
    }
  });
});

/* UPDATE POST */
router.post("/update-users-api", function (req, res, next) {
  console.log(req.body._id);
  UsersModel.findByIdAndUpdate(req.body._id, req.body, function (err, post) {
    if (err) {
      Response.errorResponse(err, res);
    } else {
      Response.successResponse("User updated!", res, {});
    }
  });
});

//GENERATE AND DOWNLOAD PDF
router.get("/wireman-exampdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("wireman-exampdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("wireman-exam.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.download("wireman-exam.pdf", (err) => {
              console.log(err);
              console.log("working..");
            });
          }
        });
    }
  });
});

router.get("/wireman-suitpdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("wireman-suitpdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("wireman-suit.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            // res.send("File created successfully");
            res.download("wireman-suit.pdf", (err) => {
              console.log(err);
            });
          }
        });
    }
  });
});

router.get("/supervisor-exampdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("supervisor-exampdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("supervisor-exam.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.download("supervisor-exam.pdf", (err) => {
              console.log(err);
            });
          }
        });
    }
  });
});

router.get("/supervisor-suitpdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("supervisor-suitpdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("supervisor-suit.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            // res.send("File created successfully");
            res.download("supervisor-suit.pdf", (err) => {
              console.log(err);
            });
          }
        });
    }
  });
});

router.get("/WSRexam-pdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("WSRexam-pdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf.create(data, options).toFile("WSRexam.pdf", function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.download("WSRexam.pdf", (err) => {
            console.log(err);
          });
        }
      });
    }
  });
});
router.get("/new-contractorPdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("new-contractorPdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("new-contractor.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.download("new-contractor.pdf", (err) => {
              console.log(err);
            });
          }
        });
    }
  });
});

//GENERATE AND DOWNLOAD PDF
router.get("/contractorlicense-renewalPdf", async function (req, res, next) {
  const user = await UsersModel.findById(req.user.id, {}).lean();
  // console.log(user)

  res.render("contractorlicense-renewalPdf", { user: user }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      let options = {
        format: "A3",
        orientation: "letter",
        border: "5mm",
        header: {
          height: "10mm",
          // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
          height: "10mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };
      pdf
        .create(data, options)
        .toFile("contractorlicense-renewal.pdf", function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.download("contractorlicense-renewal.pdf", (err) => {
              console.log(err);
            });
          }
        });
    }
  });
});

//CODE FOR DOWNLOAD PDF
router.get("/download", (req, res) => {
  res.download("report.pdf", (err) => {
    console.log(err);
  });
  console.log("Your file has been downloaded!");
});

router.get("/generatePDF", function (req, res, next) {
  // res.render('login-form');
  res.render("/generatePDF");
});

// router.get("/generatePDF", (req, res) => {
// 	// ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), {
//     handlebars.renderFile(path.join(__dirname, './views/', "generatePDF.handlebars"), {
//         students: students
//     }, (err, data) => {
//         if (err) {
//             res.send(err);
//         } else {
//             let options = {format: "A3",
// 			orientation: "portrait",
// 			border: "10mm"

//             };
//             pdf.create(data, options).toFile("report.pdf", function (err, data) {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.send("File created successfully");
//                 }
//             });
//         }
//     });
// })
// router.post('/generatePDF', function(req, res, next) {
//   res.redirect('../generatePDF');
// })

router.get("/googletranslate", function (req, res, next) {
  // res.render('login-form');
  res.render("googletranslate");
  // res.send('please check google translator')
});

router.get("/payments", function (req, res, next) {
  // res.render('login-form');
  res.render("payments");
  // res.send('please check google translator')
});

router.get("/all/users", async (req, res) => {
  await UsersModel.find()
    .select("-__v")
    .then((docs) => {
      if (docs.length >= 1) {
        res.status(200).json({
          message: "succcess",
          count: docs.length,
          docs: docs,
        });
      } else {
        res.status(200).json({
          message: "success",
          docs: "no vendors available yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "some error occured while fetching data 5",
        error: err,
      });
    });
});

module.exports = router;
