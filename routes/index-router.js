const express = require("express");
const router = express.Router()
const {landingPageController, registerController, postRegisterController, loginController, logoutController, profileController} = require("../controllers/index-controller")
const { isLoggedIn, redirectIfLogin } = require("../middleswares/auth-middleswares")


router.get("/", redirectIfLogin,landingPageController)
router.get("/register",registerController)
router.post("/register",postRegisterController)
router.post("/login",loginController)
router.get("/logout",logoutController)
router.get("/profile",isLoggedIn,profileController)
router.get("/hello",function(req,res){
    console.log("hello")
})



module.exports= router