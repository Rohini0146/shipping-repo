const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LoginModel = mongoose.model("Login", LoginSchema);

module.exports = LoginModel;
