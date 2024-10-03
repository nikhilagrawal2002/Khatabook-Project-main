const HisaabModel = require("../models/hisaab-model")
const UserModel = require("../models/users-model")
module.exports.createHisaabController = async function (req, res) {
    let { title, description, encrypted, shareable, passcode, editpermissions } = req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;
    let user = await UserModel.findOne({ email: req.user.email });


    let hisaab = await HisaabModel.create({
        title: title,
        description: description,
        user: user._id,
        encrypted: encrypted,
        shareable: shareable,
        passcode: passcode,
        editpermissions: editpermissions,
    });

    user.hisaab.push(hisaab._id);

    await user.save();

    res.redirect("/profile");
}
module.exports.hisaabPageController = function (req, res) {
    res.render("create")
}
module.exports.viewHisaabController = async function (req, res) {
    let hisaab = await HisaabModel.findOne({ _id: req.params.id })
    if (hisaab.encrypted) {

        if (req.session.hisaabaccess === req.params.id) {
            req.session.hisaabaccess = ""
            res.render("hisaab", { hisaab })
        }
        else {
            res.redirect(`/hisaab/${hisaab._id}/passcode`)
        }
    }
    else {
        res.render("hisaab", { hisaab })
    }
}
module.exports.passcodeController = async function (req, res) {
    let hisaab = await HisaabModel.findOne({ _id: req.params.id })
    res.render("passcode", { hisaab })
}
module.exports.verifyPasscodeController = async function (req, res) {
    let hisaab = await HisaabModel.findOne({ _id: req.params.id })
    if (hisaab.passcode === req.body.passcode) {
        req.session.hisaabaccess = req.params.id;

        res.redirect(`/hisaab/view/${hisaab._id}`)
    }
    else {
        res.redirect(`/hisaab/${hisaab._id}/passcode`)
    }
}
module.exports.deleteHisaabController = async function (req, res) {
    let hisaab = await HisaabModel.findOne({ _id: req.params.id })
    if (hisaab.user.toString() === req.user.id) {
        await HisaabModel.deleteOne({ _id: hisaab._id })
        const user = await UserModel.findOne({_id:req.user._id})
        user.hisaab.splice(user.hisaab.indexOf(hisaab._id), 1);
        await user.save()
        res.redirect("/profile")
    } else {
        res.send("access denied");
    }
}
module.exports.editHisaabController = async function(req,res){
    res.send("will show edit page")
}