const mongoose = require("mongoose");

const DinasuvaduInvoiceSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerAddress: { type: String, required: true },
  buyerGSTIN: { type: String, required: true },
  buyerPhoneNumber: { type: String },
  shipToName: { type: String },
  shipToAddress: { type: String },
  shipToGSTIN: { type: String },
  shipToPhoneNumber: { type: String },
  invoiceNumber: { type: String, unique: true, required: true },
  date: { type: Date, required: true },
  salesType: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      hsnCode: { type: String },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      taxableValue: { type: Number },
      cgstPercentage: { type: Number }, // Add percentage fields
      sgstPercentage: { type: Number },
      igstPercentage: { type: Number },
      cgstAmount: { type: Number },
      sgstAmount: { type: Number },
      igstAmount: { type: Number },
      total: { type: Number, required: true },
    },
  ],
  totalTaxableValue: { type: Number },
  igst: { type: Number },
  cgst: { type: Number },
  sgst: { type: Number },
  netPayable: { type: Number, required: true },
});

const DinasuvaduInvoiceModel = mongoose.model(
  "DinasuvaduInvoice",
  DinasuvaduInvoiceSchema
);

module.exports = DinasuvaduInvoiceModel;
