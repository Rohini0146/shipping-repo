import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Input,
  Button,
  Col,
  Typography,
  message,
  Select,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log("Form values:", values); // Add this to debug
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        values
      );
      if (response.status === 200) {
        message.success("Signup successful!");
        form.resetFields();
        navigate("/");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Col span={24}>
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: "16px" }}
          >
            Signup
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="userName"
              label="Username"
              rules={[{ required: true, message: "Please enter a username" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  pattern: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter a valid password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Category">
                <Select.Option value="shipping">Shipping</Select.Option>
                <Select.Option value="dinasuvadu">Dinasuvadu</Select.Option>
                <Select.Option value="muskdeer">Muskdeer</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Signup
              </Button>
            </Form.Item>
          </Form>
          <Form.Item style={{ textAlign: "center" }}>
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}

export default Signup;
