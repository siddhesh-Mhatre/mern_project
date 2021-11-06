const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../db/conn");
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate");
const getallData = require("../middleware/getallData");
router.get("/", (req, res) => {
  res.send(`hello world from the server roter.js`);
});

 

// using asyn
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "plz filled data" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "email allredy exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not maching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();
      res.status(201).json({ message: "user register sucessfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route
router.post("/signin", async (req, res) => {
  //  console.log(req.body);
  //  res.json({message :"awsome"});
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "plz fill the data" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      // console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid Credinatial" });
      } else {
        res.json({ message: "user loging sucessfully" });
      }
    } else {
      res.status(400).json({ error: "invalid Credinatial" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us page
router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// get user data for contact us and home page
router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// contact us page
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contact form");
      return res.status(400).json({ error: "plzz fill the contact form" });
    }
    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res.status(201).json({ message: "user contact sucessfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// logout us page
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});

// get all data
router.get("/getall", async (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      console.log(err);
    }
    res.send(users);
  });
});

// update the data
router.post("/update", async (req, res) => {
  const { _id, chatPass } = req.body;
  // console.log(req.body);
  User.findById(_id, function (err, employee) {
    if (!employee)
      return next(new Error("Unable to Find Employee With This Id"));
    else {
      employee.chatPass = chatPass;

      employee
        .save()
        .then((emp) => {
          res.json("Employee Updated Successfully");
        })
        .catch((err) => {
          res.status(400).send("Unable To Update Employee");
        });
    }
  });
});



// edite
router.post("/edite", async (req, res) => {
  const { _id,name,phone,email,work } = req.body;
  console.log(_id,name,phone,email,work);

  User.findById(_id, function (err, employee) {
    if (!employee)
      return next(new Error("Unable to Find Employee With This Id"));
    else {

 
    //  employee.name=name? name : employee.name;
    //   employee.phone=phone ? phone : employee.phone;
    //   employee.email=email ? email : employee.email;f
    //   employee.work=work ? work : employee.work;
     
if(name!==undefined){
  employee.name = name;
}    
if(phone!==undefined){
  employee.phone = phone;
}    
if(email!==undefined){
  employee.email = email;
}     
if(work!==undefined){
  employee.work = work;
}
 
        employee
        .save()
        .then((emp) => {
          res.json("Employee Updated Successfully");
        })
        .catch((err) => {
          res.status(400).send("Unable To Update Employee");
        });
    }
  });

});


module.exports = router;
