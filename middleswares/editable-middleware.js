const HisaabModel = require("../models/hisaab-model");
const UserModel = require("../models/users-model");

module.exports.sharedWithUpdate = async function sharedWithUpdate(req, res, next) {
    try {
        const hisaab = await HisaabModel.findOne({ _id: req.params.id });

        if (!hisaab.editpermissions) {
            if (req.user._id.toString() !== hisaab.user.toString()) {
                if (!hisaab.sharedWith.includes(req.user._id.toString())) {
                    hisaab.sharedWith.push(req.user._id);
                    await hisaab.save();
                }
            }
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

module.exports.editpermissionsCheck = async function editpermissionsCheck(req, res, next) {
    try {
        const hisaab = await HisaabModel.findOne({ _id: req.params.id });
        if (req.user._id.toString() === hisaab.user.toString()) {
            next();
        }
        if (!hisaab.editpermissions) {
            if (!hisaab.requests.some(request => request.user.toString() === req.user._id.toString())) {
                hisaab.requests.push({
                    user: req.user._id
                })
                await hisaab.save();
            }
            return res.send("check mongo")

        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}
