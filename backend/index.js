const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const InvoiceModel = require("./models/Invoice");
const LoginModel = require("./models/Login");
const SignupModel = require("./models/Signup");
const DinasuvaduInvoiceModel = require("./models/DinasuvaduInvoice");
const BuyerModel = require("./models/buyers");
const ShipperModel = require("./models/Shippers");
const ConsigneeModel = require("./models/Consignee");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/shippingdetails", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await SignupModel.findOne({ userName, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    res.status(200).json({
      message: "Login successful",
      category: user.category, // Send the category along with the response
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { userName, email, phoneNumber, password, category } = req.body;
  console.log("Received data:", req.body); // Debugging step
  try {
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const newUser = new SignupModel({
      userName,
      email,
      phoneNumber,
      password,
      category, // Ensure category is being passed and saved
    });

    await newUser.save();
    res.status(200).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create an Invoice
app.post("/api/invoices", async (req, res) => {
  try {
    const newInvoice = new InvoiceModel(req.body);
    await newInvoice.save();
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
});

// Fetch All Invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await InvoiceModel.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
});

// Fetch a Single Invoice by ID
app.get("/api/invoices/:id", async (req, res) => {
  try {
    const invoice = await InvoiceModel.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch invoice", error: error.message });
  }
});

// Update an Invoice by ID
app.put("/api/invoices/:id", async (req, res) => {
  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to update invoice", error: error.message });
  }
});

// Delete an Invoice by ID
app.delete("/api/invoices/:id", async (req, res) => {
  try {
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
});

app.post("/api/dinasuavduinvoices", async (req, res) => {
  try {
    const newInvoice = new DinasuvaduInvoiceModel(req.body);
    await newInvoice.save();
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Error saving invoice:", error.message); // Log the error
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
});

app.get("/api/dinasuvaduinvoices", async (req, res) => {
  try {
    const dinasuvaduinvoices = await DinasuvaduInvoiceModel.find();
    res.status(200).json(dinasuvaduinvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Failed to fetch invoices", error });
  }
});

// Get Invoice by ID
app.get("/api/dinasuvaduinvoices/:id", async (req, res) => {
  try {
    const invoice = await DinasuvaduInvoiceModel.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Failed to fetch invoice", error });
  }
});

// Update an invoice by ID
app.put("/api/dinasuvaduinvoices/:id", async (req, res) => {
  try {
    const updatedInvoice = await DinasuvaduInvoiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Ensure schema validation
      }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Failed to update invoice", error });
  }
});

app.post("/api/buyers", async (req, res) => {
  try {
    const newBuyer = new BuyerModel(req.body);
    await newBuyer.save();
    res
      .status(201)
      .json({ message: "Buyer created successfully", buyer: newBuyer });
  } catch (error) {
    console.error("Validation error details:", error.message); // Log the error message
    res
      .status(400)
      .json({ message: "Validation failed", error: error.message });
  }
});

app.get("/api/buyers", async (req, res) => {
  try {
    const buyers = await BuyerModel.find();
    res.json(buyers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching buyers", error: error.message });
  }
});

// Fetch a Single Buyer by ID
app.get("/api/buyers/:id", async (req, res) => {
  try {
    const buyer = await BuyerModel.findById(req.params.id);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res.status(200).json(buyer);
  } catch (error) {
    console.error("Error fetching buyer:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch buyer", error: error.message });
  }
});

// Update an Buyers by ID

app.put("/api/buyers/:id", async (req, res) => {
  try {
    const updatedBuyer = await BuyerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    res
      .status(200)
      .json({ message: "Buyer updated successfully", buyer: updatedBuyer });
  } catch (error) {
    console.error("Error updating buyer:", error);
    res
      .status(500)
      .json({ message: "Failed to update buyer", error: error.message });
  }
});

app.post("/api/Shippers", async (req, res) => {
  try {
    const newShipper = new ShipperModel(req.body);
    await newShipper.save();
    res.status(201).json({
      message: "Shipper created successfully",
      satisfieshipper: newShipper,
    });
  } catch (error) {
    console.error("Validation error details:", error.message); // Log the error message
    res
      .status(400)
      .json({ message: "Validation failed", error: error.message });
  }
});

app.get("/api/Shippers", async (req, res) => {
  try {
    const Shippers = await ShipperModel.find();
    res.json(Shippers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Shippers", error: error.message });
  }
});

// Correct the route to use findById instead of findByIdAndUpdate for fetching
app.get("/api/Shippers/:id", async (req, res) => {
  try {
    const shipper = await ShipperModel.findById(req.params.id);
    if (!shipper) {
      return res.status(404).json({ message: "Shipper not found" });
    }
    res.status(200).json(shipper);
  } catch (error) {
    console.error("Error fetching Shipper:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch Shipper details",
        error: error.message,
      });
  }
});

app.put("/api/Shippers/:id", async (req, res) => {
  try {
    const updatedShippers = await ShipperModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedShippers) {
      return res.status(404).json({ message: "Shippers not found" });
    }
    res
      .status(200)
      .json({
        message: "Shippers updated successfully",
        shippers: updatedShippers,
      });
  } catch (error) {
    console.error("Error updating Shippers:", error);
    res
      .status(500)
      .json({ message: "Failed to update Shippers", error: error.message });
  }
});

// Delete an Invoice by ID
app.delete("/api/Shippers/:id", async (req, res) => {
  try {
    const deletedShippers = await ShipperModel.findByIdAndDelete(req.params.id);
    if (!deletedShippers) {
      return res.status(404).json({ message: "Shippers not found" });
    }
    res.status(200).json({ message: "Shippers deleted successfully" });
  } catch (error) {
    console.error("Error deleting Shippers:", error);
    res
      .status(500)
      .json({ message: "Failed to delete Shippers", error: error.message });
  }
});


app.post("/api/Consignee", async (req, res) => {
  try {
    const newConsignee = new ConsigneeModel(req.body);
    await newConsignee.save();
    res.status(201).json({
      message: "Consignee created successfully",
      consignee: newConsignee,
    });
  } catch (error) {
    console.error("Validation error details:", error.message); // Log the error message
    res
      .status(400)
      .json({ message: "Validation failed", error: error.message });
  }
});

app.get("/api/Consignee", async (req, res) => {
  try {
    const Consignee = await ConsigneeModel.find();
    res.json(Consignee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Consignee", error: error.message });
  }
});

app.get("/api/consignee/:id", async (req, res) => {
  try {
    const consignee = await ConsigneeModel.findById(req.params.id);
    if (!consignee) {
      return res.status(404).json({ message: "Consignee not found" });
    }
    res.status(200).json(consignee);
  } catch (error) {
    console.error("Error fetching Consignee:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch Consignee details",
        error: error.message,
      });
  }
});

app.put("/api/consignee/:id", async (req, res) => {
  try {
    const updatedConsignee = await ConsigneeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedConsignee) {
      return res.status(404).json({ message: "Consignee not found" });
    }
    res
      .status(200)
      .json({
        message: "Consignee updated successfully",
        consignee: updatedConsignee,
      });
  } catch (error) {
    console.error("Error updating Consignee:", error);
    res
      .status(500)
      .json({ message: "Failed to update Consignee", error: error.message });
  }
});

app.delete("/api/consignee/:id", async (req, res) => {
  try {
    const deletedConsignee = await ConsigneeModel.findByIdAndDelete(req.params.id);
    if (!deletedConsignee) {
      return res.status(404).json({ message: "Consignee not found" });
    }
    res.status(200).json({ message: "Consignee deleted successfully" });
  } catch (error) {
    console.error("Error deleting Consignee:", error);
    res
      .status(500)
      .json({ message: "Failed to delete Consignee", error: error.message });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
