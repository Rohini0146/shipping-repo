import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Row, Col, Layout } from "antd";
import axios from "axios";
const { Header, Content } = Layout;
const { Title } = Typography;

const ConsigneeForm = () => {
  const [formData, setFormData] = useState({
    consigneeName: "",
    companyNamee: "",
    addressLineOne: "",
    addressLineTwo: "",
    addressLineThree: "",
    mobileNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Consignee",
        formData
      );
      alert("Consignee added successfully!");
      console.log(response.data);
      setFormData({
        consigneeName: "",
        companyNamee: "",
        addressLineOne: "",
        addressLineTwo: "",
        addressLineThree: "",
        mobileNo: "",
      });
    } catch (error) {
      console.error("Error adding consignee:", error);
      alert("Failed to add consignee.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Add Consignee
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
                  label="Consignee Name*"
                  name="consigneeName"
                  rules={[
                    {
                      required: false,
                      message: "Please enter the consignee name",
                    },
                  ]}
                >
                  <Input
                    name="consigneeName"
                    value={formData.consigneeName}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Company Name*"
                  name="companyNamee"
                  rules={[
                    {
                      required: false,
                      message: "Please enter the company name",
                    },
                  ]}
                >
                  <Input
                    name="companyNamee"
                    value={formData.companyNamee}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 1*"
                  name="addressLineOne"
                  rules={[
                    {
                      required: false,
                      message: "Please enter address line One",
                    },
                  ]}
                >
                  <Input
                    name="addressLineOne"
                    value={formData.addressLineOne}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 2*"
                  name="addressLineTwo"
                  rules={[
                    {
                      required: false,
                      message: "Please enter address line Two",
                    },
                  ]}
                >
                  <Input
                    name="addressLineTwo"
                    value={formData.addressLineTwo}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Address Line 3*"
                  name="addressLineThree"
                  rules={[
                    {
                      required: false,
                      message: "Please enter address line Three",
                    },
                  ]}
                >
                  <Input
                    name="addressLineThree"
                    value={formData.addressLineThree}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Mobile Number*"
                  name="mobileNo"
                  rules={[
                    { required: false, message: "Please enter Mobile No" },
                  ]}
                >
                  <Input
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item>
                  <Row justify="center">
                    <Col>
                      <Button type="primary" htmlType="submit">
                        Save Consignee
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

export default ConsigneeForm;
