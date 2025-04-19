import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Space,
  Button,
  Descriptions,
  message,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';
const { Header, Content } = Layout;
const { Title } = Typography;

const ConsigneeView = () => {
  const [consignee, setConsignee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the consignee ID from the URL

  useEffect(() => {
    const fetchConsignee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/consignee/${id}`
        );
        setConsignee(response.data);
      } catch (error) {
        console.error("Error fetching consignee details:", error);
        message.error("Error fetching consignee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsignee();
  }, [id]);

  const handleBack = () => {
    navigate("/dashboard/consignee-lists"); // Navigate back to the consignees list
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

  if (!consignee) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            padding: "20px",
            backgroundColor: "#f0f2f5",
            paddingTop: "30px",
          }}
        >
          <Typography.Text>No consignee found.</Typography.Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Consignee Details
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
                {consignee.consigneeName}
              </Title>
            </Space>
          }
          style={{ width: "100%" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Consignee Name">
              {consignee.consigneeName}
            </Descriptions.Item>
            <Descriptions.Item label="Company Name">
              {consignee.companyNamee}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 1">
              {consignee.addressLineOne}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 2">
              {consignee.addressLineTwo}
            </Descriptions.Item>
            <Descriptions.Item label="Address Line 3">
              {consignee.addressLineThree}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {consignee.mobileNo}
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

export default ConsigneeView;
