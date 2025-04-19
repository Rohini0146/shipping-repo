import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Typography,
  Table,
  Button,
  Select,
  Layout,
} from "antd";

import logo from "../logo.png"; // Replace with your logo path
import "../Shipping-Invoice/Invoice.css";
const { Header } = Layout;

const { Title, Text } = Typography;
const { Option } = Select;

const Invoice = () => {
  const [formData, setFormData] = useState({
    shipper: "",
    consignee: "",
    notify: "",
    billOfLandingNo: "",
    placeOfReceipt: "",
    partOfLoading: "",
    partOfDischarge: "",
    placeOfDelivery: "",
    vesselVoyage: "",
    noOfOriginalBl: "",
    termsOfShipment: "",
    freightPrepaidAt: "",
    grossWeight: "",
    netWeight: "",
    measurement: "",
    applyTo: "",
    issue: "",
    signed: "",
    shipperName: "",
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    mobileNumber: "",
    consigneeName: "",
    companyNamee: "",
    addressLineOne: "",
    addressLineTwo: "",
    addressLineThree: "",
    mobileNo: "",
    containerDetails: [
      {
        containerNo: "",
        seal: "",
        packages: "",
        grossWeight: "",
        netWeight: "",
      },
    ],
  });

  const [shippers, setShippers] = useState([]);
  const [consignees, setConsignees] = useState([]);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Shippers");
        const data = await response.json();
        setShippers(data);
      } catch (error) {
        console.error("Error fetching shippers:", error);
      }
    };

    fetchShippers();
  }, []);

  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Consignee");
        const data = await response.json();
        setConsignees(data);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      }
    };

    fetchConsignees();
  }, []);

  const handleShipperSelect = (shipperId) => {
    const selected = shippers.find((shipper) => shipper._id === shipperId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        shipperName: selected.shipperName,
        companyName: selected.companyName,
        addressLine1: selected.addressLine1,
        addressLine2: selected.addressLine2,
        addressLine3: selected.addressLine3,
        mobileNumber: selected.mobileNumber,
      }));
    }
  };

  const handleConsigneeSelect = (consigneeId) => {
    const selected = consignees.find(
      (consignee) => consignee._id === consigneeId
    );
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        consigneeName: selected.consigneeName,
        companyNamee: selected.companyNamee,
        addressLineOne: selected.addressLineOne,
        addressLineTwo: selected.addressLineTwo,
        addressLineThree: selected.addressLineThree,
        mobileNo: selected.mobileNo,
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    const formattedShipper = `
      ${formData.shipperName}
      ${formData.companyName}
      ${formData.addressLine1}
      ${formData.addressLine2}
      ${formData.addressLine3}
      ${formData.mobileNumber || ""}
    `.trim();

    const formattedConsignee = `
      ${formData.consigneeName}
      ${formData.companyNamee}
      ${formData.addressLineOne}
      ${formData.addressLineTwo}
      ${formData.addressLineThree}
      ${formData.mobileNo || ""}
    `.trim();

    try {
      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          shipper: formattedShipper,
          consignee: formattedConsignee,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Invoice saved successfully:", data);
        alert("Invoice saved successfully!");
        // Reset form
        setFormData({
          shipper: "",
          consignee: "",
          notify: "",
          billOfLandingNo: "",
          placeOfReceipt: "",
          partOfLoading: "",
          partOfDischarge: "",
          placeOfDelivery: "",
          vesselVoyage: "",
          noOfOriginalBl: "",
          termsOfShipment: "",
          freightPrepaidAt: "",
          grossWeight: "",
          netWeight: "",
          measurement: "",
          containerDetails: [
            {
              containerNo: "",
              seal: "",
              packages: "",
              grossWeight: "",
              netWeight: "",
            },
          ],
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to save invoice:", errorData);
        alert(`Failed to save invoice: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice. Please try again.");
    }
  };

  const handleContainerChange = (index, field, value) => {
    const updatedContainers = [...formData.containerDetails];
    updatedContainers[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      containerDetails: updatedContainers,
    }));
  };

  const addContainerRow = () => {
    setFormData((prev) => ({
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
    const updatedContainers = formData.containerDetails.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      containerDetails: updatedContainers,
    }));
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
          Create Invoice
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

                  <Select
                    placeholder="Select Shipper"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleShipperSelect}
                  >
                    {Array.isArray(shippers) && shippers.length > 0 ? (
                      shippers.map((shipper) => (
                        <Select.Option key={shipper._id} value={shipper._id}>
                          {shipper.shipperName || "Unknown Shipper"}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>No Shippers Found</Select.Option>
                    )}
                  </Select>
                  <Input.TextArea
                    rows={9}
                    readOnly
                    value={`
      ${formData.shipperName || ""}
      ${formData.companyName || ""}
      ${formData.addressLine1 || ""}
      ${formData.addressLine2 || ""}
      ${formData.addressLine3 || ""}
      ${formData.mobileNumber || ""}
    `}
                  />
                </div>
                <div
                  style={{
                    borderBottom: "2px solid #003366",
                    padding: "20px",
                  }}
                >
                  <Text strong>CONSIGNEE:</Text>
                  <Select
                    placeholder="Select Consignee"
                    style={{
                      width: "100%",
                    }}
                    onChange={handleConsigneeSelect}
                  >
                    {Array.isArray(consignees) && consignees.length > 0 ? (
                      consignees.map((consignee) => (
                        <Select.Option
                          key={consignee._id}
                          value={consignee._id}
                        >
                          {consignee.consigneeName || "Unknown Consignee"}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>No Consignee Found</Select.Option>
                    )}
                  </Select>
                  <Input.TextArea
                    rows={9}
                    readOnly
                    value={`
      ${formData.consigneeName || ""}
      ${formData.companyNamee || ""}
      ${formData.addressLineOne || ""}
      ${formData.addressLineTwo || ""}
      ${formData.addressLineThree || ""}
      ${formData.mobileNo || ""}
    `}
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
                    value={formData.notify}
                    onChange={(e) => handleChange("notify", e.target.value)}
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
                    value={formData.billOfLandingNo}
                    onChange={(e) =>
                      handleChange("billOfLandingNo", e.target.value)
                    }
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
                style={{
                  borderRight: "2px solid #003366",
                  padding: "10px",
                  paddingLeft: "20px",
                }}
              >
                <Text strong style={{ paddingLeft: "10px" }}>
                  Place of Receipt
                </Text>
                <Input
                  value={formData.placeOfReceipt}
                  onChange={(e) =>
                    handleChange("placeOfReceipt", e.target.value)
                  }
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
                <Text strong>Part of Loading</Text>
                <Input
                  value={formData.partOfLoading}
                  onChange={(e) =>
                    handleChange("partOfLoading", e.target.value)
                  }
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
                <Text strong>Part of Discharge</Text>
                <Input
                  value={formData.partOfDischarge}
                  onChange={(e) =>
                    handleChange("partOfDischarge", e.target.value)
                  }
                />
              </Col>
              <Col span={6} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>Place of Delivery</Text>
                <Input
                  value={formData.placeOfDelivery}
                  onChange={(e) =>
                    handleChange("placeOfDelivery", e.target.value)
                  }
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
                  value={formData.vesselVoyage}
                  onChange={(e) => handleChange("vesselVoyage", e.target.value)}
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
                  value={formData.noOfOriginalBl}
                  onChange={(e) =>
                    handleChange("noOfOriginalBl", e.target.value)
                  }
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
                  value={formData.termsOfShipment}
                  onChange={(e) =>
                    handleChange("termsOfShipment", e.target.value)
                  }
                />
              </Col>
              <Col span={6} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>Freight Prepaid At</Text>
                <Input
                  value={formData.freightPrepaidAt}
                  onChange={(e) =>
                    handleChange("freightPrepaidAt", e.target.value)
                  }
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
                  value={formData.containerNo}
                  onChange={(e) => handleChange("containerNo", e.target.value)}
                />
              </Col>
              <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  No. of <br /> Packages
                </Text>
                <Input
                  value={formData.noOfPackages}
                  onChange={(e) => handleChange("noOfPackages", e.target.value)}
                />
              </Col>
              <Col span={6} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  Stow, Count & Seal
                  <br /> SAID TO CONTAIN
                </Text>
                <Input.TextArea
                  rows={9}
                  value={formData.saidToContain}
                  onChange={(e) =>
                    handleChange("saidToContain", e.target.value)
                  }
                />
              </Col>
              <Col span={5} style={{ padding: "10px", paddingLeft: "20px" }}>
                <div>
                  <Text strong>
                    Gross Wt.
                    <br /> kg.
                  </Text>
                  <Input
                    value={formData.grossWeight}
                    onChange={(e) =>
                      handleChange("grossWeight", e.target.value)
                    }
                  />
                </div>
                <div style={{ marginTop: "30px" }}>
                  <Text strong>
                    Net Wt.
                    <br /> kg.
                  </Text>
                  <Input
                    value={formData.netWeight}
                    onChange={(e) => handleChange("netWeight", e.target.value)}
                  />
                </div>
              </Col>
              <Col span={4} style={{ padding: "10px", paddingLeft: "20px" }}>
                <Text strong>
                  Measurement <br /> CBM
                </Text>
                <Input
                  value={formData.measurement}
                  onChange={(e) => handleChange("measurement", e.target.value)}
                />
              </Col>
            </Row>
          </div>
          {/* Container Details: */}
          <div className="section bordered" style={{ padding: "20px" }}>
            <Table
              dataSource={formData.containerDetails}
              columns={[
                {
                  title: "Container #",
                  dataIndex: "containerNo",
                  key: "containerNo",
                  render: (_, __, index) => (
                    <Input
                      value={formData.containerDetails[index].containerNo}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "containerNo",
                          e.target.value
                        )
                      }
                    />
                  ),
                },
                {
                  title: "Seal",
                  dataIndex: "seal",
                  key: "seal",
                  render: (_, __, index) => (
                    <Input
                      value={formData.containerDetails[index].seal}
                      onChange={(e) =>
                        handleContainerChange(index, "seal", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Packages",
                  dataIndex: "packages",
                  key: "packages",
                  render: (_, __, index) => (
                    <Input
                      value={formData.containerDetails[index].packages}
                      onChange={(e) =>
                        handleContainerChange(index, "packages", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Gross Weight",
                  dataIndex: "grossWeight",
                  key: "grossWeight",
                  render: (_, __, index) => (
                    <Input
                      value={formData.containerDetails[index].grossWeight}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "grossWeight",
                          e.target.value
                        )
                      }
                    />
                  ),
                },
                {
                  title: "Net Weight",
                  dataIndex: "netWeight",
                  key: "netWeight",
                  render: (_, __, index) => (
                    <Input
                      value={formData.containerDetails[index].netWeight}
                      onChange={(e) =>
                        handleContainerChange(
                          index,
                          "netWeight",
                          e.target.value
                        )
                      }
                    />
                  ),
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_, __, index) => (
                    <Button
                      type="danger"
                      onClick={() => removeContainerRow(index)}
                      disabled={formData.containerDetails.length === 1}
                    >
                      Remove
                    </Button>
                  ),
                },
              ]}
              pagination={false}
              bordered
              rowKey={(record, index) => index}
            />
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={addContainerRow}
            >
              Add Row
            </Button>
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
                    value={formData.applyTo}
                    onChange={(e) => handleChange("applyTo", e.target.value)}
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
                    value={formData.issue}
                    onChange={(e) => handleChange("issue", e.target.value)}
                  />
                </div>
                <div style={{ padding: "20px" }}>
                  <Text strong>Signed on behalf of the carrier:</Text>
                  <Input.TextArea
                    rows={4}
                    value={formData.signed}
                    onChange={(e) => handleChange("signed", e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Button type="primary" size="large" onClick={handleSave}>
              Save Invoice
            </Button>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default Invoice;
