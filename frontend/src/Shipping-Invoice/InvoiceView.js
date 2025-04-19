import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Typography, Table, Card, Spin, message, Layout, Button } from "antd";
import { FaArrowLeft } from 'react-icons/fa';
import logo from "../logo.png"; // Replace with your logo path
import "../Shipping-Invoice/Invoice.css";
const { Header } = Layout;
const { Title, Text } = Typography;

const InvoiceView = () => {
  const { id } = useParams(); // Extract the Invoice ID from the URL
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/invoices/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setInvoiceData(data);
        } else {
          message.error("Failed to fetch invoice details");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        message.error("Error fetching invoice details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!invoiceData) {
    return <div>No Invoice Found</div>;
  }
  const handleBack = () => {
    navigate("/dashboard/invoice-lists"); // Navigate back to the shippers list
  };
  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "#001529",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Invoice View
        </Title>
      </Header>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f0f2f5",
          paddingTop: "30px",
        }}
      >
  
          <div className="bill-of-lading">
            <div className="header">
              <Title
                level={3}
                className="header-title"
                style={{ textAlign: "center" }}
              >
                BILL OF LANDING
              </Title>
            </div>

            <div style={{ borderBottom: "2px solid #003366" }}>
              <Row gutter={16}>
                <Col
                  span={12}
                  style={{
                    borderRight: "2px solid #003366",
                    paddingRight: "8px",
                    paddingLeft: "8px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Text strong>SHIPPER:</Text>
                    <div>{invoiceData.shipper || "N/A"}</div>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Text strong>CONSIGNEE:</Text>
                    <div>{invoiceData.consignee || "N/A"}</div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <Text strong>Notify Party:</Text>
                    <div>{invoiceData.notify || "N/A"}</div>
                  </div>
                </Col>
                <Col
                  span={12}
                  style={{ paddingLeft: "8px", paddingRight: "8px" }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                    }}
                  >
                    <Text strong>Bill of Landing No:</Text>
                    <div>{invoiceData.billOfLandingNo || "N/A"}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={logo}
                      alt="SMS Container Lines"
                      className="logo"
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ borderBottom: "2px solid #003366" }}>
              <Row gutter={16}>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>Place of Receipt:</Text>
                  <div>{invoiceData.placeOfReceipt || "N/A"}</div>
                </Col>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>Part of Loading:</Text>
                  <div>{invoiceData.partOfLoading || "N/A"}</div>
                </Col>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>Part of Discharge:</Text>
                  <div>{invoiceData.partOfDischarge || "N/A"}</div>
                </Col>
                <Col span={6} style={{ padding: "10px" }}>
                  <Text strong>Place of Delivery:</Text>
                  <div>{invoiceData.placeOfDelivery || "N/A"}</div>
                </Col>
              </Row>
            </div>

            <div style={{ borderBottom: "2px solid #003366" }}>
              <Row gutter={16}>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>Vessel/Voyage:</Text>
                  <div>{invoiceData.vesselVoyage || "N/A"}</div>
                </Col>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>No. of Original BL:</Text>
                  <div>{invoiceData.noOfOriginalBl || "N/A"}</div>
                </Col>
                <Col
                  span={6}
                  style={{ borderRight: "2px solid #003366", padding: "10px" }}
                >
                  <Text strong>Terms of Shipment:</Text>
                  <div>{invoiceData.termsOfShipment || "N/A"}</div>
                </Col>
                <Col span={6} style={{ padding: "10px" }}>
                  <Text strong>Freight Prepaid At:</Text>
                  <div>{invoiceData.freightPrepaidAt || "N/A"}</div>
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
                  }}
                >
                  <Text strong>
                    Container Nos. <br />
                    Seal Nos./Marks & Nos
                  </Text>
                  <div>{invoiceData.containerNo || "N/A"}</div>
                </Col>
                <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                  <Text strong>
                    No. of <br /> Packages
                  </Text>
                  <div>{invoiceData.noOfPackages || "N/A"}</div>
                </Col>
                <Col
                  span={6}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    whiteSpace: "pre-line",
                  }}
                >
                  <Text strong>
                    Stow, Count & Seal
                    <br /> SAID TO CONTAIN
                  </Text>
                  <div>{invoiceData.saidToContain || "N/A"}</div>
                </Col>
                <Col span={5} style={{ padding: "10px", paddingLeft: "20px" }}>
                  <div>
                    <Text strong>
                      Gross Wt.
                      <br /> kg.
                    </Text>
                    <div>{invoiceData.grossWeight || "N/A"}</div>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <Text strong>
                      Net Wt.
                      <br /> kg.
                    </Text>
                    <div>{invoiceData.netWeight || "N/A"}</div>
                  </div>
                </Col>
                <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                  <Text strong>
                    Measurement <br /> CBM
                  </Text>
                  <div>{invoiceData.measurement || "N/A"}</div>
                </Col>
              </Row>
            </div>
            {/* Container Details Table */}
            <div style={{ padding: "20px" }}>
              <Table
                dataSource={invoiceData.containerDetails || []}
                columns={[
                  {
                    title: "Container #",
                    dataIndex: "containerNo",
                    key: "containerNo",
                  },
                  { title: "Seal", dataIndex: "seal", key: "seal" },
                  { title: "Packages", dataIndex: "packages", key: "packages" },
                  {
                    title: "Gross Weight",
                    dataIndex: "grossWeight",
                    key: "grossWeight",
                  },
                  {
                    title: "Net Weight",
                    dataIndex: "netWeight",
                    key: "netWeight",
                  },
                ]}
                pagination={false}
                bordered
              />
            </div>

            <div className="footer bordered">
              <Row gutter={16}>
                <Col
                  span={12}
                  style={{
                    borderRight: "2px solid #003366",
                    paddingRight: "0px",
                    paddingLeft: "8px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Text strong>For Delivery of Goods Apply To:</Text>
                    <div>{invoiceData.applyTo || "N/A"}</div>
                  </div>
                  <div style={{}}></div>
                </Col>
                <Col
                  span={12}
                  style={{ paddingLeft: "0px", paddingRight: "8px" }}
                >
                  <div
                    style={{
                      height: "59px",
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                    }}
                  ></div>
                  <div
                    style={{
                      borderBottom: "2px solid #003366",
                      padding: "20px",
                    }}
                  >
                    <Text strong>Place an date of issue</Text>
                    <div>{invoiceData.issue || "N/A"}</div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <Text strong>Signed on behalf of the carrier:</Text>
                    <div>{invoiceData.signed || "N/A"}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "end", marginTop:"10px" }}>
          <Button
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              fontWeight: "bolder",
              display: "flex",
              alignItems: "center",
            }}
            type="default"
            onClick={handleBack}
          >
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Back
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceView;
