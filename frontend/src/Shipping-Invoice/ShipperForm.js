import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Row, Col, Layout } from "antd";
import axios from "axios";
const { Header, Content } = Layout;
const { Title } = Typography;

const ShipperForm = () => {
  const [formData, setFormData] = useState({
    shipperName: "",
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    mobileNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Shippers",
        formData
      );
      alert("Shipper added successfully!");
      console.log(response.data);
      setFormData({
        shipperName: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        mobileNumber: "",
      });
    } catch (error) {
      console.error("Error adding shipper:", error);
      alert("Failed to add shipper.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Add Shipper
        </Title>
      </Header>
      <Content style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
        <Row
          justify="center"
          align="middle"
          style={{ minHeight: "calc(100vh - 134px)", width: "100%" }}
        >
          <Col xs={24} sm={24} md={20} lg={16} xl={12}>
            <Card>
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Shipper Name"
                  name="shipperName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the shipper name",
                    },
                  ]}
                >
                  <Input
                    name="shipperName"
                    value={formData.shipperName}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the company name",
                    },
                  ]}
                >
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 1"
                  name="addressLine1"
                  rules={[
                    { required: true, message: "Please enter address line 1" },
                  ]}
                >
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 2"
                  name="addressLine2"
                  rules={[
                    { required: true, message: "Please enter address line 2" },
                  ]}
                >
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 3"
                  name="addressLine3"
                  rules={[
                    { required: true, message: "Please enter address line 3" },
                  ]}
                >
                  <Input
                    name="addressLine3"
                    value={formData.addressLine3}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[
                    { required: false, message: "Please enter Mobile Number" },
                  ]}
                >
                  <Input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Row justify="center">
                    <Col>
                      <Button type="primary" htmlType="submit">
                        Save Shipper
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ShipperForm;
