import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Card,
  Typography,
  Divider,
} from "antd";
import axios from "axios";

const { Title } = Typography;

const DinasuvaduInvoiceEdit = () => {
  const { id: invoiceId } = useParams(); // Extract the invoiceId from the URL
  const [invoiceData, setInvoiceData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/dinasuvaduinvoices/${invoiceId}`
        );
        const data = response.data;

        // Map GST details for each item
        const updatedItems = data.items.map((item) => {
          const taxableValue = parseFloat(item.taxableValue || 0);
          const cgstPercentage = taxableValue
            ? ((parseFloat(item.cgstAmount || 0) / taxableValue) * 100).toFixed(
                2
              )
            : 0;
          const sgstPercentage = taxableValue
            ? ((parseFloat(item.sgstAmount || 0) / taxableValue) * 100).toFixed(
                2
              )
            : 0;
          const igstPercentage = taxableValue
            ? ((parseFloat(item.igstAmount || 0) / taxableValue) * 100).toFixed(
                2
              )
            : 0;

          return {
            ...item,
            cgstPercentage,
            sgstPercentage,
            igstPercentage,
          };
        });

        setInvoiceData({
          ...data,
          items: updatedItems,
        });
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      }
    };

    if (invoiceId) fetchInvoiceDetails();
  }, [invoiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = invoiceData.items.map((item, idx) => {
      if (idx === index) {
        const updatedItem = { ...item, [field]: value };

        // Calculate amounts dynamically
        const price = parseFloat(updatedItem.price || 0);
        const qty = parseFloat(updatedItem.qty || 0);
        const taxableValue = price * qty;

        const cgstPercentage = parseFloat(updatedItem.cgstPercentage || 0);
        const sgstPercentage = parseFloat(updatedItem.sgstPercentage || 0);
        const igstPercentage = parseFloat(updatedItem.igstPercentage || 0);

        const cgstAmount = (taxableValue * cgstPercentage) / 100;
        const sgstAmount = (taxableValue * sgstPercentage) / 100;
        const igstAmount = (taxableValue * igstPercentage) / 100;

        const total = taxableValue + cgstAmount + sgstAmount + igstAmount;

        return {
          ...updatedItem,
          taxableValue: taxableValue.toFixed(2),
          cgstAmount: cgstAmount.toFixed(2),
          sgstAmount: sgstAmount.toFixed(2),
          igstAmount: igstAmount.toFixed(2),
          total: total.toFixed(2),
        };
      }
      return item;
    });

    // Update totals for the invoice
    const totalTaxableValue = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.taxableValue || 0),
      0
    );
    const totalCgst = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.cgstAmount || 0),
      0
    );
    const totalSgst = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.sgstAmount || 0),
      0
    );
    const totalIgst = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.igstAmount || 0),
      0
    );
    const netPayable = totalTaxableValue + totalCgst + totalSgst + totalIgst;

    setInvoiceData((prev) => ({
      ...prev,
      items: updatedItems,
      totalTaxableValue: totalTaxableValue.toFixed(2),
      cgst: totalCgst.toFixed(2),
      sgst: totalSgst.toFixed(2),
      igst: totalIgst.toFixed(2),
      netPayable: netPayable.toFixed(2),
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/dinasuvaduinvoices/${invoiceId}`,
        invoiceData
      );
      alert("Invoice updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Failed to update invoice. Please try again.");
    }
  };

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record, index) =>
        isEditing ? (
          <Input
            value={text}
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "HSN Code",
      dataIndex: "hsnCode",
      key: "hsnCode",
      render: (text, record, index) =>
        isEditing ? (
          <Input
            value={text}
            onChange={(e) => handleItemChange(index, "hsnCode", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) =>
        isEditing ? (
          <Input
            type="number"
            value={text}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      render: (text, record, index) =>
        isEditing ? (
          <Input
            type="number"
            value={text}
            onChange={(e) => handleItemChange(index, "qty", e.target.value)}
          />
        ) : (
          text
        ),
    },

    {
      title: "CGST (%)",
      dataIndex: "cgstPercentage",
      key: "cgstPercentage",
      render: (text, record) =>
        isEditing ? (
          <Input
            type="number"
            value={record.cgstPercentage || ""}
            onChange={(e) =>
              handleItemChange(record.key, "cgstPercentage", e.target.value)
            }
          />
        ) : (
          `${record.cgstPercentage || 0}%`
        ),
    },
    {
      title: "SGST (%)",
      dataIndex: "sgstPercentage",
      key: "sgstPercentage",
      render: (text, record) =>
        isEditing ? (
          <Input
            type="number"
            value={record.sgstPercentage || ""}
            onChange={(e) =>
              handleItemChange(record.key, "sgstPercentage", e.target.value)
            }
          />
        ) : (
          `${record.sgstPercentage || 0}%`
        ),
    },
    {
      title: "IGST (%)",
      dataIndex: "igstPercentage",
      key: "igstPercentage",
      render: (text, record) =>
        isEditing ? (
          <Input
            type="number"
            value={record.igstPercentage || ""}
            onChange={(e) =>
              handleItemChange(record.key, "igstPercentage", e.target.value)
            }
          />
        ) : (
          `${record.igstPercentage || 0}%`
        ),
    },

    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `₹${parseFloat(text || 0).toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Editable Invoice Details" bordered>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Invoice Details</Title>
            <Input
              placeholder="Invoice No"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Date"
              name="date"
              type="date"
              value={invoiceData.date}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Sales Type"
              name="salesType"
              value={invoiceData.salesType}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Buyer Details</Title>
            <Input
              placeholder="Buyer Name"
              name="buyerName"
              value={invoiceData.buyerName}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
            <Input.TextArea
              placeholder="Buyer Address"
              name="buyerAddress"
              value={invoiceData.buyerAddress}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Buyer GSTIN"
              name="buyerGSTIN"
              value={invoiceData.buyerGSTIN}
              onChange={handleChange}
              disabled={!isEditing}
              style={{ marginBottom: "10px" }}
            />
          </Col>
        </Row>
        <Divider />
        <Title level={5}>Items</Title>
        <Table
          dataSource={invoiceData.items.map((item, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
          pagination={false}
        />
        <Divider />
        <Row justify="end">
          {!isEditing ? (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Edit Invoice
            </Button>
          ) : (
            <>
              <Button
                type="default"
                onClick={() => setIsEditing(false)}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default DinasuvaduInvoiceEdit;
