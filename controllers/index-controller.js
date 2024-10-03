const userModel = require("../models/users-model")
const hisaabModel = require("../models/hisaab-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.landingPageController = function (req, res) {
    res.render("index", { isloggedin: false })
}
module.exports.registerController = function (req, res) {
    res.render("register")
}
module.exports.postRegisterController = async function (req, res) {
    try {
        let { name, username, email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) return res.send("Sorry you already have account, please login.");

        if (process.env.JWT_SECRET) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    let createduser = await userModel.create({
                        email,
                        username,
                        name,
                        password: hash,
                    });

                    let token = jwt.sign(
                        { email, id: createduser._id },
                        process.env.JWT_SECRET
                    );

                    res.cookie("token", token);
                    res.redirect("/profile");
                });
            });
        } else {
            res.send("you forgot the env variables");
        }
    } catch (err) {

        res.send(err.message);
    }
}
module.exports.loginController = async function (req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email }).select("+password");
        if (!user) return res.send("email or password did not match");

        if (process.env.JWT_SECRET) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);

                    res.cookie("token", token);
                    res.redirect("/profile");
                } else {
                    res.send("koi gadbad");
                }
            });
        } else {
            res.send("you dont have env variables setup");
        }
    } catch (err) {
        res.send(err.message);
    }
}
module.exports.logoutController = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
}
module.exports.profileController = async function (req, res) {
    let byDate = Number(req.query.byDate);
    let {startDate ,endDate} = req.query;

    byDate = byDate?byDate:-1;
    startDate = startDate?startDate:new Date("1970-01-01");
    endDate = endDate?endDate:new Date();
    
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate({
            path:"hisaab",
            match:{createdAt:{$gte:startDate,$lte:endDate}},
            options:{sort:{createdAt:byDate}}
        })

    res.render("profile", { user });
}