const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//SIGNUP ROUTE
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save in database",
      });
    }
    res.json({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      id: user._id,
    });
  });
};

//SIGNIN ROUTE
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    //email not found in database
    if (!user) {
      return res.status(400).json({
        error: "Email is not registered",
      });
    }
    //error occured while logging in
    if (err) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
    //wrong password
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Incorrect Password",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9000 });

    //send response to front end
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "signout successful",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};

exports.isEmployer = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are a Student",
    });
  }

  next();
};
