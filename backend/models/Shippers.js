const mongoose = require("mongoose");

const shipperSchema = new mongoose.Schema({
  shipperName: { type: String, default: "" },
  companyName: { type: String, default: "" },
  addressLine1: { type: String, default: ""},
  addressLine2: { type: String, default: "" },
  addressLine3: { type: String, default: "" },
  mobileNumber: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const ShipperModel = mongoose.model("Shipper", shipperSchema);

module.exports = ShipperModel;
