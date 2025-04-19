import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvoiceList from "./Shipping-Invoice/InvoiceList";
import InvoiceEdit from "./Shipping-Invoice/InvoiceEdit";
import InvoiceView from "./Shipping-Invoice/InvoiceView";
import Invoice from "./Shipping-Invoice/Invoice.js";
import DinasuvaduInvoice from "./Dinasuvadu-Invoice/DinasuvaduInvoice";
import MuskdeerInvoice from "./Muskdeer-invoice/MuskdeerInvoice";
import BuyersForm from "./Dinasuvadu-Invoice/BuyersForm";
import Login from "./Login";
import Signup from "./Signup";
import "./index.css";
import DinasuvaduInvoiceLists from "./Dinasuvadu-Invoice/DinasuvaduInvoiceLists.js";
import DinasuvaduInvoiceEdit from "./Dinasuvadu-Invoice/DinasuvaduInvoiceEdit.js";
import BuyerLists from "./Dinasuvadu-Invoice/BuyerLists.js";
import EditBuyer from "./Dinasuvadu-Invoice/EditBuyer.js";
import ShipperForm from "./Shipping-Invoice/ShipperForm.js";
import ConsigneeForm from "./Shipping-Invoice/ConsigneeForm.js";
import GstCalculator from "./GstCalculator.js";
import Dashboard from "./Dashboard.jsx";
import ShipperLists from "./Shipping-Invoice/ShipperLists.js";
import ConsigneeLists from "./Shipping-Invoice/ConsigneeLists.js";
import EditShipper from "./Shipping-Invoice/EditShipper.js";
import EditConsignee from "./Shipping-Invoice/EditConsignee.js";
import ShipperView from "./Shipping-Invoice/ShipperView.js";
import ConsigneeView from "./Shipping-Invoice/ConsigneeView.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="create-new-invoice" element={<Invoice />} />
          <Route path="invoice-lists" element={<InvoiceList />} />
          <Route path="invoice/edit/:id" element={<InvoiceEdit />} />
          <Route path="invoice/view/:id" element={<InvoiceView />} />
          <Route path="add-shipper" element={<ShipperForm />} />
          <Route path="shipper-lists" element={<ShipperLists />} />
          <Route path="shippers/edit/:id" element={<EditShipper />} />
          <Route path="shippers/view/:id" element={<ShipperView />} />
          <Route path="add-consignee" element={<ConsigneeForm />} />
          <Route path="consignee-lists" element={<ConsigneeLists />} />
          <Route path="consignees/edit/:id" element={<EditConsignee />} />
          <Route path="consignees/view/:id" element={<ConsigneeView />} />
          <Route path="gst-calculator" element={<GstCalculator />} />
        </Route>

        <Route path="/dinasuvadu-invoice" element={<DinasuvaduInvoice />} />
        <Route path="/muskdeer-invoice" element={<MuskdeerInvoice />} />
        <Route path="/add-buyer" element={<BuyersForm />} />
        <Route
          path="/dinasuvadu-invoice-lists"
          element={<DinasuvaduInvoiceLists />}
        />
        <Route
          path="/dinasuvadu-invoice/edit/:id"
          element={<DinasuvaduInvoiceEdit />}
        />
        <Route path="/buyer-lists" element={<BuyerLists />} />
        <Route path="/buyers/edit/:id" element={<EditBuyer />} />
      </Routes>
    </Router>
  );
}

export default App;
