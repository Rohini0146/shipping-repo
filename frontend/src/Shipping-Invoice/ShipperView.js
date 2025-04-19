import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Descriptions,
  Space,
  Button,
  Spin,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
const { Header, Content } = Layout;
const { Title } = Typography;

const ShipperView = () => {
  const [shipper, setShipper] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the shipper ID from the URL

  useEffect(() => {
    const fetchShipper = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/Shippers/${id}`
        );
        setShipper(response.data);
      } catch (error) {
        console.error("Error fetching shipper details:", error);
        message.error("Error fetching shipper details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShipper();
  }, [id]);

  const handleBack = () => {
    navigate("/dashboard/shipper-lists"); // Navigate back to the shippers list
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            padding: "20px",
            backgroundColor: "#f0f2f5",
            paddingTop: "30px",
          }}
        >
          <Spin tip="Loading..." />
        </Content>
      </Layout>
    );
  }

  if (!shipper) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            padding: "20px",
            backgroundColor: "#f0f2f5",
            paddingTop: "30px",
          }}
        >
          <Typography.Text>No shipper found.</Typography.Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Shipper Details
        </Title>
      </Header>
      <Content
        style={{
          padding: "20px",
          backgroundColor: "#f0f2f5",
          paddingTop: "30px",
        }}
      >
        <Card
          title={
            <Space style={{ display: "flex", alignItems: "center" }}>
              <Title level={3} style={{ margin: 0 }}>
                {shipper.shipperName}
              </Title>
            </Space>
          }
          style={{ width: "100%" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Shipper Name">
              {shipper.shipperName}
            </Descriptions.Item>
            <Descriptions.Item label="Company Name">
              {shipper.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 1">
              {shipper.addressLine1}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 2">
              {shipper.addressLine2}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 3">
              {shipper.addressLine3}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {shipper.mobileNumber}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}
        >
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
      </Content>
    </Layout>
  );
};

export default ShipperView;
