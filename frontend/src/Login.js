import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Input, Button, Col, Typography, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

function Login() {
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        user
      );
      if (response.status === 200) {
        message.success("Login successful");
        // Redirect based on the category
        const category = response.data.category;
        if (category === "dinasuvadu") {
          navigate("/dinasuvadu-invoice-lists");
        } else if (category === "shipping") {
          navigate("/dashboard");
        } else if (category === "muskdeer") {
          navigate("/muskdeer-invoice");
        }
      }
    } catch (error) {
      console.log(error);
      message.error("Login failed");
    }
  };

  return (
    <div
      style={{
        padding: "50px 16px",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            title={
              <Title level={3} style={{ textAlign: "center" }}>
                Login
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Username"
                name="userName"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  name="userName"
                  value={user.userName}
                  onChange={handleChange}
                  prefix={<UserOutlined />}
                  placeholder="Enter your username"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <p>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
