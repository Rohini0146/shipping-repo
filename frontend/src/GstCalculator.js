import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  InputNumber,
  Select,
  Card,
  Typography,
  Row,
  Col,
} from "antd";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const GstCalculator = () => {
  const [amount, setAmount] = useState(0);
  const [gstRate, setGstRate] = useState(5);
  const [gstType, setGstType] = useState("Exclusive");
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateGST();
  }, [amount, gstRate, gstType]);

  const calculateGST = () => {
    let gst;
    let total;
    if (gstType === "Exclusive") {
      gst = (amount * gstRate) / 100;
      total = amount + gst;
    } else {
      gst = (amount * gstRate) / (100 + gstRate);
      total = amount;
    }
    setGstAmount(gst);
    setTotalAmount(total);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          GST Calculator
        </Title>
      </Header>
      <Content style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
        <Row
          justify="center"
          align="middle"
          style={{ minHeight: "calc(100vh - 180px)", width: "100%" }}
        >
          <Col xs={24} sm={24} md={20} lg={16} xl={24}>
            <Card
              style={{
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#f7f9fc",
              }}
            >
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Amount" required>
                      <InputNumber
                        value={amount}
                        onChange={(value) => setAmount(value)}
                        style={{ width: "100%" }}
                        min={0}
                        step={0.01}
                        placeholder="Enter the amount"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="GST %" required>
                      <Select
                        value={gstRate}
                        onChange={(value) => setGstRate(value)}
                        style={{ width: "100%" }}
                      >
                        <Option value={5}>5%</Option>
                        <Option value={12}>12%</Option>
                        <Option value={18}>18%</Option>
                        <Option value={28}>28%</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Tax">
                      <Select
                        value={gstType}
                        onChange={(value) => setGstType(value)}
                        style={{ width: "100%" }}
                      >
                        <Option value="Exclusive">Exclusive</Option>
                        <Option value="Inclusive">Inclusive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Row justify="space-between" align="middle">
                  <Col span={8}>
                    <Text strong style={{ fontSize: 24, color: "#000" }}>
                      ₹{amount.toFixed(2)}
                    </Text>
                    <Text style={{ display: "block", color: "#007bff" }}>
                      Actual Amount
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Text strong style={{ fontSize: 24, color: "green" }}>
                      + ₹{gstAmount.toFixed(2)}
                    </Text>
                    <Text style={{ display: "block", color: "#28a745" }}>
                      GST Amount
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Text strong style={{ fontSize: 24, color: "#000" }}>
                      = ₹{totalAmount.toFixed(2)}
                    </Text>
                    <Text style={{ display: "block", color: "#007bff" }}>
                      Total Amount
                    </Text>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default GstCalculator;
