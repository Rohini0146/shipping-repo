const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true, // Add category field to store the selected category
    enum: ["shipping", "dinasuvadu", "muskdeer"], // Only allow these values
  },
});

const SignupModel = mongoose.model("Signup", SignupSchema);
module.exports = SignupModel;
