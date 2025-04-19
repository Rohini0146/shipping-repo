import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Card,
  Typography,
  Divider,
  Select,
} from "antd";
import axios from "axios";
import { Option } from "antd/es/mentions";

const { Title, Text } = Typography;

const DinasuvaduInvoice = () => {
  const [buyers, setBuyers] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    date: "",
    buyerName: "",
    buyerAddress: "",
    buyerGSTIN: "",
    buyerPhoneNumber: "", // Added
    shipToName: "", // Added
    shipToAddress: "", // Added
    shipToGSTIN: "", // Added
    shipToPhoneNumber: "", // Added
    salesType: "",
    items: [],
    totalAmount: 0,
    taxableValue: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    totalTaxableValue: 0, // Added
    netPayable: 0, // Added
  });

  const [item, setItem] = useState({
    description: "",
    hsnCode: "",
    price: "",
    qty: "",
    cgstPercentage: "",
    sgstPercentage: "",
    igstPercentage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/buyers");
        console.log("Fetched Buyers:", response.data); // Debugging
        setBuyers(response.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      }
    };
    fetchBuyers();
  }, []);

  const handleSaveInvoice = async () => {
    const preparedInvoice = {
      buyerName: invoiceData.buyerName,
      buyerAddress: invoiceData.buyerAddress,
      buyerGSTIN: invoiceData.buyerGSTIN,
      buyerPhoneNumber: invoiceData.buyerPhoneNumber,
      shipToName: invoiceData.shipToName || invoiceData.buyerName,
      shipToAddress: invoiceData.shipToAddress || invoiceData.buyerAddress,
      shipToGSTIN: invoiceData.shipToGSTIN || invoiceData.buyerGSTIN,
      shipToPhoneNumber: invoiceData.shipToPhoneNumber,
      invoiceNumber: invoiceData.invoiceNo,
      date: invoiceData.date,
      salesType: invoiceData.salesType,
      items: invoiceData.items.map((item) => ({
        ...item,
        cgstAmount:
          (item.taxableValue * parseFloat(item.cgstPercentage || 0)) / 100,
        sgstAmount:
          (item.taxableValue * parseFloat(item.sgstPercentage || 0)) / 100,
        igstAmount:
          (item.taxableValue * parseFloat(item.igstPercentage || 0)) / 100,
      })),
      totalTaxableValue: invoiceData.taxableValue,
      igst: invoiceData.igst,
      cgst: invoiceData.cgst,
      sgst: invoiceData.sgst,
      netPayable: invoiceData.totalAmount,
    };

    console.log("Prepared Invoice Data:", preparedInvoice);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/dinasuavduinvoices",
        preparedInvoice
      );
      console.log("Invoice Saved:", response.data);
      alert("Invoice saved successfully!");
    } catch (error) {
      console.error(
        "Error saving invoice:",
        error.response?.data || error.message
      );
      alert("Failed to save invoice. Check all required fields.");
    }
  };

  const handleBuyerSelect = (buyerId) => {
    const selected = buyers.find((buyer) => buyer._id === buyerId);
    if (selected) {
      setInvoiceData((prev) => ({
        ...prev,
        buyerName: selected.companyName,
        buyerAddress: `${selected.addressLine1 || ""} ${
          selected.addressLine2 || ""
        }, ${selected.city || ""}, ${selected.state || ""}`,
        buyerGSTIN: selected.gstin,
        buyerPhoneNumber: selected.mNumber || "N/A",
        shipToName: selected.companyName,
        shipToAddress: `${selected.addressLine1 || ""} ${
          selected.addressLine2 || ""
        }, ${selected.city || ""}, ${selected.state || ""}`,
        shipToGSTIN: selected.gstin,
        shipToPhoneNumber: selected.mNumber || "N/A",
      }));
    }
  };

  const addItem = () => {
    const price = parseFloat(item.price || 0);
    const qty = parseInt(item.qty || 0);
    const taxableValue = price * qty;

    const cgstPercentage = parseFloat(item.cgstPercentage || 0);
    const sgstPercentage = parseFloat(item.sgstPercentage || 0);
    const igstPercentage = parseFloat(item.igstPercentage || 0);

    const cgstAmount = (taxableValue * cgstPercentage) / 100;
    const sgstAmount = (taxableValue * sgstPercentage) / 100;
    const igstAmount = (taxableValue * igstPercentage) / 100;

    const total = taxableValue + cgstAmount + sgstAmount + igstAmount;

    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...item,
          taxableValue: taxableValue.toFixed(2),
          cgstAmount: cgstAmount.toFixed(2),
          sgstAmount: sgstAmount.toFixed(2),
          igstAmount: igstAmount.toFixed(2),
          total: total.toFixed(2),
        },
      ],
      taxableValue: (prev.taxableValue || 0) + taxableValue,
      cgst: (prev.cgst || 0) + cgstAmount,
      sgst: (prev.sgst || 0) + sgstAmount,
      igst: (prev.igst || 0) + igstAmount,
      totalAmount: (prev.totalAmount || 0) + total,
    }));

    // Clear the current item fields after adding
    setItem({
      description: "",
      hsnCode: "",
      price: "",
      qty: "",
      cgstPercentage: "",
      sgstPercentage: "",
      igstPercentage: "",
    });
  };

  const columns = [
    {
      title: "SR. NO",
      dataIndex: "srNo",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    { title: "DESCRIPTION", dataIndex: "description", key: "description" },
    { title: "HSN CODE", dataIndex: "hsnCode", key: "hsnCode" },
    { title: "PRICE", dataIndex: "price", key: "price" },
    { title: "QTY", dataIndex: "qty", key: "qty" },
    {
      title: "CGST (%)",
      dataIndex: "cgstPercentage",
      key: "cgstPercentage",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.cgstPercentage || ""}
          onChange={(e) => {
            const updatedItems = [...invoiceData.items];
            updatedItems[index].cgstPercentage = e.target.value;
            updatedItems[index].cgstAmount =
              (updatedItems[index].taxableValue * e.target.value) / 100;
            setInvoiceData((prev) => ({
              ...prev,
              items: updatedItems,
            }));
          }}
        />
      ),
    },
    {
      title: "SGST (%)",
      dataIndex: "sgstPercentage",
      key: "sgstPercentage",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.sgstPercentage || ""}
          onChange={(e) => {
            const updatedItems = [...invoiceData.items];
            updatedItems[index].sgstPercentage = e.target.value;
            updatedItems[index].sgstAmount =
              (updatedItems[index].taxableValue * e.target.value) / 100;
            setInvoiceData((prev) => ({
              ...prev,
              items: updatedItems,
            }));
          }}
        />
      ),
    },
    {
      title: "IGST (%)",
      dataIndex: "igstPercentage",
      key: "igstPercentage",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.igstPercentage || ""}
          onChange={(e) => {
            const updatedItems = [...invoiceData.items];
            updatedItems[index].igstPercentage = e.target.value;
            updatedItems[index].igstAmount =
              (updatedItems[index].taxableValue * e.target.value) / 100;
            setInvoiceData((prev) => ({
              ...prev,
              items: updatedItems,
            }));
          }}
        />
      ),
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      render: (text) => text || "0.00",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {/* Form Section */}
        <Col span={8}>
          <Card title="Invoice Form" bordered>
            <Title level={5}>Invoice Details</Title>
            <Input
              placeholder="Invoice No"
              name="invoiceNo"
              value={invoiceData.invoiceNo}
              onChange={handleChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Date"
              name="date"
              type="date"
              value={invoiceData.date}
              onChange={handleChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Sales Type"
              name="salesType"
              value={invoiceData.salesType}
              onChange={handleChange}
              style={{ marginBottom: "10px" }}
            />

            <Divider />
            <Title level={5}>Add Item</Title>
            <Input
              placeholder="Description"
              name="description"
              value={item.description}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="HSN Code"
              name="hsnCode"
              value={item.hsnCode}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={item.price}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Quantity"
              name="qty"
              type="number"
              value={item.qty}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="CGST (%)"
              name="cgstPercentage"
              type="number"
              value={item.cgst}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="SGST (%)"
              name="sgstPercentage"
              type="number"
              value={item.sgst}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="IGST (%)"
              name="igstPercentage"
              type="number"
              value={item.igst}
              onChange={handleItemChange}
              style={{ marginBottom: "10px" }}
            />

            <Button type="primary" onClick={addItem}>
              Add Item
            </Button>
          </Card>
        </Col>

        {/* Invoice Preview */}
        <Col span={16}>
          <Card title="Invoice Preview" bordered>
            <Title level={4} style={{ textAlign: "center" }}>
              DINASUVADU MEDIA
            </Title>
            <p style={{ textAlign: "center" }}>
              No: 5A/510, Caldwell Colony, 5th Street, Thoothukudi - 628008
            </p>
            <p style={{ textAlign: "center" }}>GSTIN: 33BHRPC9031N2ZZ</p>
            <Divider />
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "10px" }}
            >
              <Col span={24}>
                <Text strong>Select Buyer:</Text>
                <Select
                  placeholder="Select Buyer"
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    marginBottom: "10px",
                  }}
                  onChange={handleBuyerSelect}
                >
                  {Array.isArray(buyers) && buyers.length > 0 ? (
                    buyers.map((buyer) => (
                      <Select.Option key={buyer._id} value={buyer._id}>
                        {buyer.companyName || "Unknown Company"}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option disabled>No Buyers Found</Select.Option>
                  )}
                </Select>
              </Col>
            </Row>

            <Row justify="space-between">
              {/* Buyer Name and Address */}
              <Col>
                <Text strong>Buyer Name:</Text> {invoiceData.buyerName || "N/A"}
                <br />
                <Text strong>Buyer Address:</Text>{" "}
                {invoiceData.buyerAddress || "N/A"}
                <br />
                <Text strong>GSTIN:</Text> {invoiceData.buyerGSTIN || "N/A"}
                <br />
                <Text strong>Phone Number</Text>{" "}
                {invoiceData.buyerPhoneNumber || "N/A"}
                <br />
              </Col>

              {/* Invoice Number and Date */}
              <Col>
                <Text strong>Invoice No:</Text> {invoiceData.invoiceNo || "N/A"}
                <br />
                <Text strong>Date:</Text> {invoiceData.date || "N/A"}
                <br />
                <Text strong>salesType:</Text> {invoiceData.salesType || "N/A"}
              </Col>
            </Row>

            <Divider />
            <Table
              dataSource={invoiceData.items.map((item, index) => ({
                ...item,
                srNo: index + 1,
              }))}
              columns={columns}
              pagination={false}
              rowKey={(record, index) => index}
            />
            <Divider />
            <Row>
              <Col span={12}>
                <Text strong>BANK NAME:</Text> HDFC
                <br />
                <Text strong>BANK ADDRESS:</Text> TIRUNELVELI
                <br />
                <Text strong>ACCOUNT NAME:</Text> DINASUVADU MEDIA
                <br />
                <Text strong>ACCOUNT NUMBER:</Text> 50200050612371
                <br />
                <Text strong>IFSC CODE:</Text> HDFC0004084
                <br />
                <Text strong>MICR CODE:</Text> 0
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Title level={5}>
                  TAXABLE VALUE: Rs. {invoiceData.taxableValue.toFixed(2)}
                </Title>
                <Title level={5}>IGST: Rs. {invoiceData.igst.toFixed(2)}</Title>
                <Title level={5}>SGST: Rs. {invoiceData.sgst.toFixed(2)}</Title>
                <Title level={5}>CGST: Rs. {invoiceData.cgst.toFixed(2)}</Title>
                <Title level={4}>
                  TOTAL: Rs. {invoiceData.totalAmount.toFixed(2)}
                </Title>
              </Col>
            </Row>
            <Divider />
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={handleSaveInvoice}
            >
              Save Invoice
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DinasuvaduInvoice;
