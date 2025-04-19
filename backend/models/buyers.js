const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: "" },
  city: { type: String, required: true },
  state: { type: String, required: true },
  gstin: { type: String, required: true },
  mNumber: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const BuyerModel = mongoose.model("Buyer", buyerSchema);

module.exports = BuyerModel;
