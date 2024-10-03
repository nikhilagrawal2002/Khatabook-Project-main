const jwt = require("jsonwebtoken");
const UserModel = require("../models/users-model")

module.exports.isLoggedIn = async function isLoggedIn(req, res, next) {
  if (req.cookies.token) {
    if (process.env.JWT_SECRET) {
      jwt.verify(req.cookies.token,process.env.JWT_SECRET,async function (err, decoded) {
          if (err) {
            res.redirect("/");
          } else {
          
            req.user = await UserModel.findOne({_id:decoded.id})
            next();
          }
        }
      );
    } else {
      res.redirect("/");
    }
  }
  else{
    res.redirect("/")
  }
}

module.exports.redirectIfLogin = function redirectIfLogin(req, res, next) {
  if (req.cookies.token) {
    res.redirect("/profile");
  } else next();
}