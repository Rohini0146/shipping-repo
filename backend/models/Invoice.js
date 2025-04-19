const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  shipper: { type: String, required: true }, // Concatenated shipper details
  consignee: { type: String, required: true }, 
  notify: { type: String, required: true },
  billOfLandingNo: { type: String, required: true },
  placeOfReceipt: { type: String, required: true },
  partOfLoading: { type: String, required: true },
  partOfDischarge: { type: String, required: true },
  placeOfDelivery: { type: String, required: true },
  vesselVoyage: { type: String, required: true },
  noOfOriginalBl: { type: String, required: true },
  termsOfShipment: { type: String, required: true },
  freightPrepaidAt: { type: String, required: true },
  containerNo: { type: String }, // Optional field
  noOfPackages: { type: String }, // Optional field
  saidToContain: { type: String, required: true },
  grossWeight: { type: String, required: true },
  netWeight: { type: String, required: true },
  measurement: { type: String }, // Optional field
  applyTo: { type: String },
  issue: { type: String },
  signed: { type: String },
  containerDetails: [
    {
      containerNo: { type: String, required: true },
      seal: { type: String, required: true },
      packages: { type: String, required: true },
      grossWeight: { type: String, required: true },
      netWeight: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);

module.exports = InvoiceModel;
