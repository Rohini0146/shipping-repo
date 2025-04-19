import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Typography,
  Table,
  Button,
  message,
  Layout,
} from "antd";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import logo from "../logo.png"; // Replace with your logo path
import "../Shipping-Invoice/Invoice.css";
const { Header } = Layout;
const { Title, Text } = Typography;

const InvoiceEdit = () => {
  const { id: invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/invoices/${invoiceId}`
        );
        setInvoiceData(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        message.error("Failed to fetch invoice details.");
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  const handleChange = (field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate("/dashboard/invoice-lists"); // Navigate back to the shippers list
  };

  const handleContainerChange = (index, field, value) => {
    const updatedContainers = invoiceData.containerDetails.map((container, i) =>
      i === index ? { ...container, [field]: value } : container
    );
    setInvoiceData((prev) => ({
      ...prev,
      containerDetails: updatedContainers,
    }));
  };

  const addContainerRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      containerDetails: [
        ...prev.containerDetails,
        {
          containerNo: "",
          seal: "",
          packages: "",
          grossWeight: "",
          netWeight: "",
        },
      ],
    }));
  };

  const removeContainerRow = (index) => {
    const updatedContainers = invoiceData.containerDetails.filter(
      (_, i) => i !== index
    );
    setInvoiceData((prev) => ({
      ...prev,
      containerDetails: updatedContainers,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/invoices/${invoiceId}`,
        invoiceData
      );
      message.success("Invoice updated successfully!");
      setIsEditing(false);
      navigate("/dashboard/invoice-lists");
    } catch (error) {
      console.error("Error updating invoice:", error);
      message.error("Failed to update invoice. Please try again.");
    }
  };

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

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
          Edit Invoice
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

          <div className="" style={{ borderBottom: "2px solid #003366" }}>
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
                  }}
                >
                  <Text strong>SHIPPER:</Text>
                  <Input.TextArea
                    rows={6}
                    value={invoiceData.shipper}
                    onChange={(e) => handleChange("shipper", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div
                  style={{
                    borderBottom: "2px solid #003366",
                    padding: "20px",
                  }}
                >
                  <Text strong>CONSIGNEE:</Text>
                  <Input.TextArea
                    rows={5}
                    value={invoiceData.consignee}
                    onChange={(e) => handleChange("consignee", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div
                  style={{
                    padding: "20px",
                  }}
                >
                  <Text strong>Notify Party:</Text>
                  <Input.TextArea
                    rows={5}
                    value={invoiceData.notify}
                    onChange={(e) => handleChange("notify", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </Col>
              <Col
                span={12}
                style={{ paddingLeft: "0px", paddingRight: "8px" }}
              >
                <div
                  style={{ borderBottom: "2px solid #003366", padding: "20px" }}
                >
                  <Text strong>Bill of Landing No</Text>
                  <Input
                    rows={5}
                    value={invoiceData.billOfLandingNo}
                    onChange={(e) =>
                      handleChange("billOfLandingNo", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={logo} alt="SMS Container Lines" className="logo" />
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ borderBottom: "2px solid #003366" }}>
            <Row gutter={16}>
              <Col
                span={6}
                style={{ padding: "20px", borderRight: "2px solid #003366" }}
              >
                <Text strong>Place of Receipt</Text>
                <Input
                  value={invoiceData.placeOfReceipt}
                  onChange={(e) =>
                    handleChange("placeOfReceipt", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col
                span={6}
                style={{ padding: "20px", borderRight: "2px solid #003366" }}
              >
                <Text strong>Part of Loading</Text>
                <Input
                  value={invoiceData.partOfLoading}
                  onChange={(e) =>
                    handleChange("partOfLoading", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col
                span={6}
                style={{ padding: "20px", borderRight: "2px solid #003366" }}
              >
                <Text strong>Part of Discharge</Text>
                <Input
                  value={invoiceData.partOfDischarge}
                  onChange={(e) =>
                    handleChange("partOfDischarge", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col span={6} style={{ padding: "20px" }}>
                <Text strong>Place of Delivery</Text>
                <Input
                  value={invoiceData.placeOfDelivery}
                  onChange={(e) =>
                    handleChange("placeOfDelivery", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
            </Row>
          </div>

          <div style={{ borderBottom: "2px solid #003366" }}>
            <Row gutter={16}>
              <Col
                span={6}
                style={{
                  borderRight: "2px solid #003366",
                  padding: "10px",
                  paddingLeft: "20px",
                }}
              >
                <Text strong style={{ paddingLeft: "10px" }}>
                  Vessel/Voyage
                </Text>
                <Input
                  value={invoiceData.vesselVoyage}
                  onChange={(e) => handleChange("vesselVoyage", e.target.value)}
                  disabled={!isEditing}
                />
              </Col>
              <Col
                span={6}
                style={{
                  borderRight: "2px solid #003366",
                  padding: "10px",
                  paddingLeft: "20px",
                }}
              >
                <Text strong>No. of Original BL</Text>
                <Input
                  value={invoiceData.noOfOriginalBl}
                  onChange={(e) =>
                    handleChange("noOfOriginalBl", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col
                span={6}
                style={{
                  borderRight: "2px solid #003366",
                  padding: "10px",
                  paddingLeft: "20px",
                }}
              >
                <Text strong>Terms of Shipment</Text>
                <Input
                  value={invoiceData.termsOfShipment}
                  onChange={(e) =>
                    handleChange("termsOfShipment", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col span={6} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>Freight Prepaid At</Text>
                <Input
                  value={invoiceData.freightPrepaidAt}
                  onChange={(e) =>
                    handleChange("freightPrepaidAt", e.target.value)
                  }
                  disabled={!isEditing}
                />
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
                <Input
                  value={invoiceData.containerNo}
                  onChange={(e) => handleChange("containerNo", e.target.value)}
                  disabled={!isEditing}
                />
              </Col>
              <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  No. of <br /> Packages
                </Text>
                <Input
                  value={invoiceData.noOfPackages}
                  onChange={(e) => handleChange("noOfPackages", e.target.value)}
                  disabled={!isEditing}
                />
              </Col>
              <Col span={6} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  Stow, Count & Seal
                  <br /> SAID TO CONTAIN
                </Text>
                <Input.TextArea
                  rows={9}
                  value={invoiceData.saidToContain}
                  onChange={(e) =>
                    handleChange("saidToContain", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </Col>
              <Col span={5} style={{ padding: "10px", paddingLeft: "20px" }}>
                <div>
                  <Text strong>
                    Gross Wt.
                    <br /> kg.
                  </Text>
                  <Input
                    value={invoiceData.grossWeight}
                    onChange={(e) =>
                      handleChange("grossWeight", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div style={{ marginTop: "30px" }}>
                  <Text strong>
                    Net Wt.
                    <br /> kg.
                  </Text>
                  <Input
                    value={invoiceData.netWeight}
                    onChange={(e) => handleChange("netWeight", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </Col>
              <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  Measurement <br /> CBM
                </Text>
                <Input
                  value={invoiceData.measurement}
                  onChange={(e) => handleChange("measurement", e.target.value)}
                  disabled={!isEditing}
                />
              </Col>
            </Row>
          </div>

          <div className="section bordered" style={{ padding: "20px" }}>
            <Table
              dataSource={invoiceData.containerDetails}
              columns={[
                {
                  title: "Container #",
                  dataIndex: "containerNo",
                  key: "containerNo",
                  render: (_, __, index) => (
                    <Input
                      value={invoiceData.containerDetails[index].containerNo}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "containerNo",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  ),
                },
                {
                  title: "Seal",
                  dataIndex: "seal",
                  key: "seal",
                  render: (_, __, index) => (
                    <Input
                      value={invoiceData.containerDetails[index].seal}
                      onChange={(e) =>
                        handleContainerChange(index, "seal", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  ),
                },
                {
                  title: "Packages",
                  dataIndex: "packages",
                  key: "packages",
                  render: (_, __, index) => (
                    <Input
                      value={invoiceData.containerDetails[index].packages}
                      onChange={(e) =>
                        handleContainerChange(index, "packages", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  ),
                },
                {
                  title: "Gross Weight",
                  dataIndex: "grossWeight",
                  key: "grossWeight",
                  render: (_, __, index) => (
                    <Input
                      value={invoiceData.containerDetails[index].grossWeight}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "grossWeight",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  ),
                },
                {
                  title: "Net Weight",
                  dataIndex: "netWeight",
                  key: "netWeight",
                  render: (_, __, index) => (
                    <Input
                      value={invoiceData.containerDetails[index].netWeight}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "netWeight",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  ),
                },
              ]}
              pagination={false}
              bordered
              rowKey={(record, index) => index}
            />
            {isEditing && (
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={addContainerRow}
              >
                Add Row
              </Button>
            )}
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
                  }}
                >
                  <Text strong>For Delivery of Goods Apply To:</Text>
                  <Input.TextArea
                    rows={5}
                    value={invoiceData.applyTo}
                    onChange={(e) => handleChange("applyTo", e.target.value)}
                    disabled={!isEditing}
                  />
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
                  style={{ borderBottom: "2px solid #003366", padding: "20px" }}
                >
                  <Text strong>Place an date of issue</Text>
                  <Input.TextArea
                    rows={4}
                    value={invoiceData.issue}
                    onChange={(e) => handleChange("issue", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div style={{ padding: "20px" }}>
                  <Text strong>Signed on behalf of the carrier:</Text>
                  <Input.TextArea
                    rows={4}
                    value={invoiceData.signed}
                    onChange={(e) => handleChange("signed", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className="footer bordered" style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Row>
                {!isEditing ? (
                  <>
                    <Button type="primary" onClick={() => setIsEditing(true)}>
                      Edit Invoice
                    </Button>
                  </>
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
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceEdit;
