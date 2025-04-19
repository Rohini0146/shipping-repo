import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Layout,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import logo from "../logo.png"; // Replace with your logo path
const { Header } = Layout;
const { Title, Text } = Typography;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const hiddenContainerRef = useRef(null); // Reference for the hidden container
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/invoices");
        if (response.ok) {
          const data = await response.json();
          const updatedData = data.map((invoice, index) => ({
            ...invoice,
            billNo: generateBillNo(index),
          }));
          setInvoices(updatedData);
        } else {
          message.error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        message.error("Error fetching invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const generateBillNo = (index) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}${String(index + 1).padStart(2, "0")}`;
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/invoice/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/dashboard/invoice/view/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Invoice deleted successfully");
        setInvoices((prev) => prev.filter((invoice) => invoice._id !== id));
      } else {
        message.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      message.error("Error deleting invoice");
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`);
      if (response.ok) {
        const invoice = await response.json();
        setViewInvoice(invoice);

        setTimeout(() => {
          const element = hiddenContainerRef.current;

          // Adjusted html2pdf options
          const options = {
            margin: [0.2, 0.2, 0.2, 0.2], // Reduce the margins to save space
            filename: `invoice_${id}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
              scale: 2, // Increase scale for better quality
              useCORS: true, // Allow cross-origin resources
              scrollY: 0, // Prevent any scrolling artifacts
            },
            jsPDF: {
              unit: "in",
              format: "letter", // Use the letter format for standard US page size
              orientation: "portrait", // Use portrait orientation
              compressPDF: true, // Try to compress the PDF to fit on one page
            },
          };

          html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
              // Reset viewInvoice to hide the rendered content
              setViewInvoice(null);
            });
        }, 500); // Delay to ensure the hidden container is rendered
      } else {
        message.error("Failed to fetch invoice details for download");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      message.error("Error downloading invoice");
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 70,
      align: "center",
    },
    { title: "Shipper Name", dataIndex: "shipper", key: "shipper", width: 150,  },
    {
      title: "Consignee Name",
      dataIndex: "consignee",
      key: "consignee",
      width: 150,
    },
    { title: "Bill No", dataIndex: "billNo", key: "billNo", width: 150,align: "center", },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            type="link"
            icon={<EyeOutlined style={{ color: "blue" }}/>}
            onClick={() => handleView(record._id)}
          />
          <Button
            type="link"
            icon={<EditOutlined style={{ color: "green" }}/>}
            onClick={() => handleEdit(record._id)}
          />
          <Button
            type="link"
            icon={<DownloadOutlined style={{ color: "orange" }} />}
            onClick={() => handleDownload(record._id)}
          />
          <Popconfirm
            title="Are you sure to delete this invoice?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 200,
    }
  ];

  return (
    <Layout>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Invoice Lists
        </Title>
      </Header>
      <Card style={{ backgroundColor: "#f0f2f5", paddingTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <Button
            type="primary"
            onClick={() => navigate("/create-new-invoice")}
          >
            Create New Invoice
          </Button>
          <Button type="default" onClick={() => window.location.reload()}>
            Refresh
          </Button> */}
        </div>
        <Table
          dataSource={invoices}
          columns={columns}
          rowKey="_id"
          loading={loading}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {viewInvoice && (
        <div
          ref={hiddenContainerRef}
          style={{
            padding: "10px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "white",
          }}
        >
          <div className="bill-of-lading">
            <div className="header">
              <Title
                level={3} // Reduce title size
                className="header-title"
                style={{ textAlign: "center", margin: "0" }}
              >
                BILL OF LANDING
              </Title>
            </div>

            <div style={{ borderBottom: "2px solid #003366", fontSize: "8px" }}>
              <Row gutter={8}>
                <Col
                  span={12}
                  style={{
                    borderRight: "2px solid #003366",
                    paddingRight: "4px",
                    paddingLeft: "4px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "10px",
                      whiteSpace: "pre-line",
                      fontSize: "12px",
                    }}
                  >
                    <Text strong>SHIPPER:</Text>
                    <div>{viewInvoice.shipper}</div>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "8px",
                      whiteSpace: "pre-line",
                      fontSize: "12px",
                    }}
                  >
                    <Text strong>CONSIGNEE:</Text>
                    <div>{viewInvoice.consignee}</div>
                  </div>
                  <div
                    style={{
                      padding: "8px",
                      whiteSpace: "pre-line",
                      fontSize: "12px",
                    }}
                  >
                    <Text strong>Notify Party:</Text>
                    <div>{viewInvoice.notify}</div>
                  </div>
                </Col>
                <Col
                  span={12}
                  style={{ paddingLeft: "4px", paddingRight: "4px" }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <Text strong>Bill of Landing No:</Text>
                    <div>{viewInvoice.billOfLandingNo}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={logo}
                      alt="SMS Container Lines"
                      style={{
                        maxWidth: "280px",
                        display: "block",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ borderBottom: "2px solid #003366", fontSize: "6px" }}>
              <Row gutter={8}>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>Place of Receipt:</Text>
                  <div>{viewInvoice.placeOfReceipt}</div>
                </Col>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>Part of Loading:</Text>
                  <div>{viewInvoice.partOfLoading}</div>
                </Col>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>Part of Discharge:</Text>
                  <div>{viewInvoice.partOfDischarge}</div>
                </Col>
                <Col span={6} style={{ padding: "8px", fontSize: "12px" }}>
                  <Text strong>Place of Delivery:</Text>
                  <div>{viewInvoice.placeOfDelivery}</div>
                </Col>
              </Row>
            </div>

            <div style={{ borderBottom: "2px solid #003366", fontSize: "6px" }}>
              <Row gutter={8}>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>Vessel/Voyage:</Text>
                  <div>{viewInvoice.vesselVoyage}</div>
                </Col>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>No. of Original BL:</Text>
                  <div>{viewInvoice.noOfOriginalBl}</div>
                </Col>
                <Col
                  span={6}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "8px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>Terms of Shipment:</Text>
                  <div>{viewInvoice.termsOfShipment}</div>
                </Col>
                <Col span={6} style={{ padding: "8px", fontSize: "12px" }}>
                  <Text strong>Freight Prepaid At:</Text>
                  <div>{viewInvoice.freightPrepaidAt}</div>
                </Col>
              </Row>
            </div>

            <div>
              <Row gutter={[16]}>
                <Col
                  span={5}
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingRight: "10px",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>
                    Container Nos. <br />
                    Seal Nos./Marks & Nos
                  </Text>
                  <div>{viewInvoice.containerNo}</div>
                </Col>
                <Col
                  span={3}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>
                    No. of <br /> Packages
                  </Text>
                  <div>{viewInvoice.noOfPackages}</div>
                </Col>
                <Col
                  span={9}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    whiteSpace: "pre-line",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>
                    Stow, Count & Seal
                    <br /> SAID TO CONTAIN
                  </Text>
                  <div>{viewInvoice.saidToContain}</div>
                </Col>
                <Col
                  span={3}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <Text strong>
                      Gross Wt.
                      <br /> kg.
                    </Text>
                    <div>{viewInvoice.grossWeight}</div>
                  </div>
                  <div style={{ marginTop: "30px", fontSize: "12px" }}>
                    <Text strong>
                      Net Wt.
                      <br /> kg.
                    </Text>
                    <div>{viewInvoice.netWeight}</div>
                  </div>
                </Col>
                <Col
                  span={3}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    fontSize: "12px",
                  }}
                >
                  <Text strong>
                    Measurement <br /> CBM
                  </Text>
                  <div>{viewInvoice.measurement}</div>
                </Col>
              </Row>
            </div>

            <div style={{ fontSize: "6px", padding: "0px" }}>
              <Table
                dataSource={viewInvoice.containerDetails || []}
                columns={[
                  {
                    title: "Container #",
                    dataIndex: "containerNo",
                    key: "containerNo",
                    render: (text) => (
                      <div style={{ padding: "0px", fontSize: "12px" }}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: "Seal",
                    dataIndex: "seal",
                    key: "seal",
                    render: (text) => (
                      <div style={{ padding: "0px", fontSize: "12px" }}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: "Packages",
                    dataIndex: "packages",
                    key: "packages",
                    render: (text) => (
                      <div style={{ padding: "0px", fontSize: "12px" }}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: "Gross Weight",
                    dataIndex: "grossWeight",
                    key: "grossWeight",
                    render: (text) => (
                      <div style={{ padding: "0px", fontSize: "12px" }}>
                        {text}
                      </div>
                    ),
                  },
                  {
                    title: "Net Weight",
                    dataIndex: "netWeight",
                    key: "netWeight",
                    render: (text) => (
                      <div style={{ padding: "0px", fontSize: "12px" }}>
                        {text}
                      </div>
                    ),
                  },
                ]}
                pagination={false}
                bordered
                size="small" // Reduces table size
                style={{ padding: "0px" }} // Ensure the table has minimal padding
                summary={() => (
                  <div style={{ padding: "0px" }}></div> // Remove padding from table summary if any
                )}
                rowClassName="no-padding" // Add custom class to remove padding from rows
              />
            </div>

            <div className="footer bordered" style={{ fontSize: "6px" }}>
              <Row gutter={8}>
                <Col
                  span={12}
                  style={{
                    borderRight: "2px solid #003366",
                    padding: "5px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "3px",
                      whiteSpace: "pre-line",
                      fontSize: "10px",
                    }}
                  >
                    <Text strong>For Delivery of Goods Apply To:</Text>
                    <div>{viewInvoice.applyTo}</div>
                  </div>
                  <div style={{}}></div>
                </Col>
                <Col span={12} style={{ padding: "5px" }}>
                  <div
                    style={{
                      height: "20px",
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                    }}
                  ></div>
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "5px",
                      fontSize: "10px",
                    }}
                  >
                    <Text strong>Place and Date of Issue:</Text>
                    <div>{viewInvoice.issue}</div>
                  </div>
                  <div style={{ padding: "5px" }}>
                    <Text strong>Signed on behalf of the carrier:</Text>
                    <div>{viewInvoice.signed}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InvoiceList;
