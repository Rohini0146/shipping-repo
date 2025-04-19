import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Typography,
  Button,
  Card,
  Modal,
  Row,
  Col,
  Divider,
} from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toWords } from "number-to-words";


const { Title, Text } = Typography;

function DinasuvaduInvoiceLists() {
  const [dinasuvaduinvoices, setDinasuvaduInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dinasuvaduinvoices"
        );
        setDinasuvaduInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleView = async (invoiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dinasuvaduinvoices/${invoiceId}`
      );
      setSelectedInvoice(response.data);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  // Function to generate and download PDF

  const handleDownload = async (invoiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dinasuvaduinvoices/${invoiceId}`
      );
      const invoice = response.data;

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("DINASUVADU MEDIA", pageWidth / 2, 15, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "No: 5A/510, Caldwell Colony, 5th street, Thoothukudi - 628008",
        pageWidth / 2,
        25,
        { align: "center" }
      );
      doc.text("GSTIN: 33BHRPC0311N2ZZ", pageWidth / 2, 30, {
        align: "center",
      });
      doc.text(
        "Mail ID: dinasuvadu@gmail.com  |  Phone: +91 95970 14938",
        pageWidth / 2,
        35,
        { align: "center" }
      );

      doc.line(10, 40, pageWidth - 10, 40); // Horizontal line

      // Buyer and Ship To Section
      const sectionStartY = 50;

       // Buyer Section
       doc.setFont("helvetica", "bold");
       doc.text("BUYER M/S:", 10, sectionStartY);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerName, 10, sectionStartY + 8);

       // Handle wrapping for buyerAddress
       const maxWidth = 80; // Set maximum width for wrapping
       const buyerAddressLines = doc.splitTextToSize(invoice.buyerAddress, maxWidth);
       doc.text(buyerAddressLines, 10, sectionStartY + 14);

       // Adjust subsequent Y positions based on the number of lines in buyerAddress
       const addressHeight = buyerAddressLines.length * 5; // Adjust the multiplier for line spacing

       doc.setFont("helvetica", "bold");
       doc.text("GSTIN:", 10, sectionStartY + 13 + addressHeight);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerGSTIN || "N/A", 23, sectionStartY +13 + addressHeight);
       doc.setFont("helvetica", "bold");
       doc.text("Mobile:", 10, sectionStartY + 19 + addressHeight);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerPhoneNumber || "N/A", 24, sectionStartY + 19 + addressHeight);

       // Ship To Section
       doc.setFont("helvetica", "bold");
       doc.text("SHIP TO M/S:", pageWidth / 2 + 5, sectionStartY);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerName, pageWidth / 2 + 5, sectionStartY + 8);

       // Handle wrapping for shipToAddress
       const shipToAddressLines = doc.splitTextToSize(invoice.buyerAddress, maxWidth);
       doc.text(shipToAddressLines, pageWidth / 2 + 5, sectionStartY + 14);

       const shipToHeight = shipToAddressLines.length * 5;

       doc.setFont("helvetica", "bold");
       doc.text("GSTIN:", pageWidth / 2 + 5, sectionStartY + 13 + shipToHeight);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerGSTIN || "N/A", pageWidth / 2 + 18, sectionStartY + 13 + shipToHeight);
       doc.setFont("helvetica", "bold");
       doc.text("Mobile:", pageWidth / 2 + 5, sectionStartY + 19 + shipToHeight);
       doc.setFont("helvetica", "normal");
       doc.text(invoice.buyerPhoneNumber || "N/A", pageWidth / 2 + 18, sectionStartY + 19 + shipToHeight);

      // Invoice Details Section
      const invoiceDetailsStartY = sectionStartY + 50;
      doc.setFont("helvetica", "bold");
      doc.text(
        `Invoice No: ${invoice.invoiceNumber}`,
        10,
        invoiceDetailsStartY
      );
      doc.text(
        `Date: ${new Date(invoice.date).toLocaleDateString()}`,
        pageWidth / 2,
        invoiceDetailsStartY
      );
      doc.text(
        `Sales Type: ${invoice.salesType}`,
        pageWidth - 50,
        invoiceDetailsStartY
      );

      // Items Table
      const itemsTableStartY = invoiceDetailsStartY + 12;
      const itemsHeaders = [
        [
          "S.No",
          "Description",
          "HSN Code",
          "Qty",
          "Price",
          "CGST %",
          "SGST %",
          "IGST %",
          "Total",
        ],
      ];
      const itemsRows = invoice.items.map((item, index) => {
        const total =
          item.price + item.cgstAmount + item.sgstAmount + item.igstAmount;
        const cgstPercentage = (
          (item.cgstAmount / item.taxableValue) *
          100
        ).toFixed(2);
        const sgstPercentage = (
          (item.sgstAmount / item.taxableValue) *
          100
        ).toFixed(2);
        const igstPercentage = (
          (item.igstAmount / item.taxableValue) *
          100
        ).toFixed(2);

        return [
          index + 1,
          item.description,
          item.hsnCode || "-",
          item.qty,
          `RS: ${item.price.toFixed(2)}`,
          `${cgstPercentage}%`,
          `${sgstPercentage}%`,
          `${igstPercentage}%`,
          `RS: ${total.toFixed(2)}`,
        ];
      });

      doc.autoTable({
        startY: itemsTableStartY,
        head: itemsHeaders,
        body: itemsRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          halign: "center",
          cellPadding: 1.5,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [0, 102, 204], // Change this to your desired color (e.g., RGB for blue)
          textColor: [255, 255, 255], // White text color for better contrast
        },
      });

      const tableEndY = doc.previousAutoTable.finalY;

      // Price Details Section
      const priceDetailsStartY = tableEndY + 15;
      const totalPrice = invoice.items.reduce(
        (sum, item) => sum + item.price,
        0
      );
      const totalCGST = invoice.items.reduce(
        (sum, item) => sum + item.cgstAmount,
        0
      );
      const totalSGST = invoice.items.reduce(
        (sum, item) => sum + item.sgstAmount,
        0
      );
      const totalIGST = invoice.items.reduce(
        (sum, item) => sum + item.igstAmount,
        0
      );
      const netPayable = invoice.netPayable;

      doc.setFont("helvetica", "bold");
      doc.text("Price Details:", pageWidth - 60, priceDetailsStartY);
      doc.setFont("helvetica", "normal");
      doc.text("Taxable Value:", pageWidth - 60, priceDetailsStartY + 8);
      doc.text(
        `RS: ${totalPrice.toFixed(2)}`,
        pageWidth - 10,
        priceDetailsStartY + 8,
        {
          align: "right",
        }
      );
      doc.text("IGST:", pageWidth - 60, priceDetailsStartY + 16);
      doc.text(
        `RS: ${totalIGST.toFixed(2)}`,
        pageWidth - 10,
        priceDetailsStartY + 16,
        {
          align: "right",
        }
      );
      doc.text("CGST:", pageWidth - 60, priceDetailsStartY + 24);
      doc.text(
        `RS: ${totalCGST.toFixed(2)}`,
        pageWidth - 10,
        priceDetailsStartY + 24,
        {
          align: "right",
        }
      );
      doc.text("SGST:", pageWidth - 60, priceDetailsStartY + 32);
      doc.text(
        `RS: ${totalSGST.toFixed(2)}`,
        pageWidth - 10,
        priceDetailsStartY + 32,
        {
          align: "right",
        }
      );
      doc.text("Freight:", pageWidth - 60, priceDetailsStartY + 40);
      doc.text("RS: 0.00", pageWidth - 10, priceDetailsStartY + 40, {
        align: "right",
      });
      doc.text("Round Off:", pageWidth - 60, priceDetailsStartY + 48);
      doc.text("RS: 0.00", pageWidth - 10, priceDetailsStartY + 48, {
        align: "right",
      });
      doc.setFont("helvetica", "bold");
      doc.text("Total:", pageWidth - 60, priceDetailsStartY + 56);
      doc.text(
        `RS: ${netPayable.toFixed(2)}`,
        pageWidth - 10,
        priceDetailsStartY + 56,
        {
          align: "right",
        }
      );

      // Net Payable in Words and Numbers
      const netPayableInWords = toWords(netPayable) + " Only";
      doc.setFont("helvetica", "bold");
      doc.text("Net Payable:", 10, priceDetailsStartY + 70);
      doc.setFont("helvetica", "normal");
      doc.text(
        `In Numbers: RS: ${netPayable.toFixed(2)}`,
        50,
        priceDetailsStartY + 70
      );
      doc.text(`In Words: ${netPayableInWords}`, 50, priceDetailsStartY + 78);

      // Bank Details Section
      const bankDetailsStartY = tableEndY + 15;
      doc.setFont("helvetica", "bold");
      doc.text("Bank Details:", 10, bankDetailsStartY);
      doc.setFont("helvetica", "normal");
      doc.text("Bank Name: HDFC", 10, bankDetailsStartY + 8);
      doc.text("Account Name: DINASUVADU MEDIA", 10, bankDetailsStartY + 16);
      doc.text("Account Number: 5020000612317", 10, bankDetailsStartY + 24);
      doc.text("IFSC Code: HDFC0000484", 10, bankDetailsStartY + 32);

      const footerStartY = priceDetailsStartY + 70;

      // Description Box - Two Columns
      // Description Box on Left
      const descriptionStartY = footerStartY + 20;
      const descriptionBoxWidth = pageWidth / 2 - 15; // Half width minus some margin
      const descriptionBoxHeight = 20;

      doc.setFont("helvetica", "bold");
      doc.text("Description:", 10, descriptionStartY);
      doc.rect(
        10,
        descriptionStartY + 2,
        descriptionBoxWidth,
        descriptionBoxHeight
      );
      doc.setFont("helvetica", "normal");
      doc.text(invoice.description || "N/A", 12, descriptionStartY + 8, {
        maxWidth: descriptionBoxWidth - 4,
      });

      // Authorized Signatory on Right
      doc.setFont("helvetica", "bold");
      doc.text("Authorized Signatory", pageWidth - 50, descriptionStartY + 15);

      // Save the PDF
      doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
    }
  };

  const generateBillNumber = (index) => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    return `${formattedDate}${String(index + 1).padStart(2, "0")}`;
  };
  
  const columns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Bill Number",
      key: "billNumber",
      render: (_, __, index) => generateBillNumber(index),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="default" onClick={() => handleView(record._id)}>
            View
          </Button>
          <Button type="default" onClick={() => handleDownload(record._id)}>
            Download
          </Button>
          <Link to={`/dinasuvadu-invoice/edit/${record._id}`}>
            <Button type="primary" style={{ marginLeft: "30px" }}>
              Edit
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Title level={2}>Saved Invoices</Title>
          </Col>
          <Col>
            <Link to={`/dinasuvadu-invoice`}>
              <Button type="primary" style={{ marginRight: "10px" }}>
                Create New Invoice
              </Button>
            </Link>
            <Link to={`/add-buyer`}>
              <Button type="default">Add Buyer</Button>
            </Link>
          </Col>
        </Row>
        <Table
          dataSource={dinasuvaduinvoices.map((invoice) => ({
            ...invoice,
            key: invoice._id,
          }))}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />

        {dinasuvaduinvoices.length === 0 && !loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Text>No invoices available.</Text>
          </div>
        )}
      </Card>

      {/* View Modal */}
      <Modal
        title={null}
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        {selectedInvoice && (
          <div style={{ padding: "20px", border: "1px solid #ccc" }}>
            <Row justify="center">
              <Col span={24} style={{ textAlign: "center" }}>
                <Title level={3}>DINASUVADU MEDIA</Title>
                <Text>
                  No: 5A/510, Caldwell Colony, 5th Street, Thoothukudi - 628008
                </Text>
                <br />
                <Text>GSTIN: 33BHRPC9031N2ZZ</Text>
                <br />
                <Text>
                  Mail ID: dinasuvadu@gmail.com | Mobile: +91 95970 - 14938
                </Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={8}>
                <Text strong style={{ marginBottom: "10px" }}>
                  BUYER M/S:
                </Text>
                <p style={{ margin: "0" }}>{selectedInvoice.buyerName}</p>
                <p style={{ margin: "0" }}>{selectedInvoice.buyerAddress}</p>
                <p style={{ margin: "0" }}>
                  GSTIN: {selectedInvoice.buyerGSTIN}
                </p>
                <p style={{ margin: "0" }}>
                  Phone: {selectedInvoice.buyerPhoneNumber}
                </p>
              </Col>
              <Col span={8}>
                <Text strong style={{ marginBottom: "10px" }}>
                  SHIP TO M/S:
                </Text>
                <p style={{ margin: "0" }}>{selectedInvoice.shipToName}</p>
                <p style={{ margin: "0" }}>{selectedInvoice.shipToAddress}</p>
                <p style={{ margin: "0" }}>
                  GSTIN: {selectedInvoice.shipToGSTIN}
                </p>
                <p style={{ margin: "0" }}>
                  Phone: {selectedInvoice.shipToPhoneNumber}
                </p>
              </Col>
              <Col span={8}>
                <Text strong>Invoice No:</Text> {selectedInvoice.invoiceNumber}
                <br />
                <Text strong>Date:</Text> {selectedInvoice.date}
                <br />
                <Text strong>Sales Type:</Text> {selectedInvoice.salesType}
              </Col>
            </Row>
            <Divider />
            <Table
              dataSource={selectedInvoice.items.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={[
                { title: "SR. NO", dataIndex: "key" },
                { title: "DESCRIPTION", dataIndex: "description" },
                { title: "HSN CODE", dataIndex: "hsnCode" },
                {
                  title: "PRICE",
                  dataIndex: "price",
                  render: (text) => `₹${text}`,
                },
                { title: "QTY", dataIndex: "qty" },
                { title: "TAXABLE VALUE", dataIndex: "taxableValue" },
                { title: "CGST", dataIndex: "cgstAmount" },
                { title: "SGST", dataIndex: "sgstAmount" },
                { title: "IGST", dataIndex: "igstAmount" },
              ]}
              pagination={false}
              bordered
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
                <Text style={{ fontSize: "16px" }} strong>
                  TAXABLE VALUE:
                </Text>{" "}
                ₹{selectedInvoice.totalTaxableValue}
                <br />
                <Text style={{ fontSize: "16px" }} strong>
                  CGST:
                </Text>{" "}
                ₹{selectedInvoice.cgst}
                <br />
                <Text style={{ fontSize: "16px" }} strong>
                  SGST:
                </Text>{" "}
                ₹{selectedInvoice.sgst}
                <br />
                <Text style={{ fontSize: "16px" }} strong>
                  IGST:
                </Text>{" "}
                ₹{selectedInvoice.igst}
                <br />
                <Title style={{ fontSize: "20px" }}>
                  TOTAL: ₹{selectedInvoice.netPayable}
                </Title>
              </Col>
            </Row>
            <Divider />
            <Row justify="center">
              <Text strong>Authorized Signature</Text>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DinasuvaduInvoiceLists;
