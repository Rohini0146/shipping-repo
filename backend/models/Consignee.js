const mongoose = require("mongoose");

const consigneeSchema = new mongoose.Schema({
  consigneeName: { type: String, default: "" },
  companyNamee: { type: String, default: "" },
  addressLineOne: { type: String, default: ""},
  addressLineTwo: { type: String, default: "" },
  addressLineThree: { type: String, default: "" },
  mobileNo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const ConsigneeModel = mongoose.model("Consignee", consigneeSchema);

module.exports = ConsigneeModel;
