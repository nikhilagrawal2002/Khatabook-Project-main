const express = require("express")
const router = express.Router();
const { isLoggedIn, redirectIfLogin } = require("../middleswares/auth-middleswares");
const {sharedWithUpdate, editpermissionsCheck} = require("../middleswares/editable-middleware")
const { createHisaabController, hisaabPageController, viewHisaabController, passcodeController, verifyPasscodeController, deleteHisaabController, editHisaabController } = require("../controllers/hisaab-controller");

router.get("/create",isLoggedIn,hisaabPageController)
router.post("/create",isLoggedIn,createHisaabController)
router.get("/view/:id",isLoggedIn,sharedWithUpdate,viewHisaabController)
router.get("/:id/passcode",isLoggedIn,passcodeController)
router.post("/:id/verify",isLoggedIn,verifyPasscodeController)
router.get("/delete/:id",isLoggedIn,deleteHisaabController)
router.get("/edit/:id",isLoggedIn,editpermissionsCheck,editHisaabController)

module.exports = router