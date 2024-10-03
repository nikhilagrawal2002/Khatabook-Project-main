const mongoose = require("mongoose");

const hisaabSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    shareable: {
      type: Boolean,
      default: false,
    },
    passcode: {
      type: String,
      default: "",
    },
    editpermissions: {
      type: Boolean,
      default: false,
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        requestedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("hisaab", hisaabSchema);