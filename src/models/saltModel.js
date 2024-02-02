const mongoose = require("mongoose");

const saltSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  salt: {
    type: String,
    required: [true, "Please provide a salt!"],
  },
});

const Salt = mongoose.model("Salt", saltSchema);

module.exports = Salt;
