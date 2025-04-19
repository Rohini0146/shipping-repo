import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Form, Table, Row, Col, message } from "antd";

const MuskdeerInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    totalAmount: 0,
  });

  const [form] = Form.useForm();

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  // Handle item field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setInvoiceData({
      ...invoiceData,
      items: newItems,
    });
  };

  // Add a new item to the invoice
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  // Calculate total amount
  const calculateTotal = () => {
    const total = invoiceData.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setInvoiceData({
      ...invoiceData,
      totalAmount: total,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/invoices",
        invoiceData
      );
      message.success("Invoice submitted successfully");
      console.log(response.data);
      form.resetFields();
    } catch (error) {
      message.error("Error submitting invoice");
      console.error("Error submitting invoice:", error);
    }
  };

  // Table columns for displaying items
  const columns = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Total", dataIndex: "total", key: "total" },
  ];

  // Data for the Table
  const tableData = invoiceData.items.map((item, index) => ({
    key: index,
    description: item.description,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Invoice</h1>
      <Form form={form} onSubmitCapture={handleSubmit} layout="vertical">
        {/* Customer Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Customer Name" name="customerName" required>
              <Input
                name="customerName"
                value={invoiceData.customerName}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Customer Email" name="customerEmail" required>
              <Input
                name="customerEmail"
                value={invoiceData.customerEmail}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Items Table */}
        <h2>Items</h2>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowClassName="editable-row"
          bordered
        />

        <Button
          type="dashed"
          onClick={addItem}
          style={{ width: "100%", marginTop: "16px" }}
        >
          Add Item
        </Button>

        <Button
          type="primary"
          onClick={calculateTotal}
          style={{ marginTop: "16px" }}
        >
          Calculate Total
        </Button>

        {/* Total Amount */}
        <h3 style={{ marginTop: "20px" }}>
          Total Amount: <strong>${invoiceData.totalAmount}</strong>
        </h3>

        {/* Submit Button */}
        <Button type="primary" htmlType="submit" style={{ marginTop: "16px" }}>
          Submit Invoice
        </Button>
      </Form>
    </div>
  );
};

export default MuskdeerInvoice;
