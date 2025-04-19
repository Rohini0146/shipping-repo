import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Typography,
  Button,
  message,
  Row,
  Col,
  Layout,
} from "antd";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';
const { Header, Content } = Layout;
const { Title } = Typography;

const EditShipper = () => {
  const { id: shipperId } = useParams();
  const [shipperData, setShipperData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipper = async () => {
      try {
        // Check if shipperId is valid
        if (!shipperId) {
          throw new Error("Invalid Shipper ID");
        }
        const response = await axios.get(
          `http://localhost:5000/api/Shippers/${shipperId}`
        );
        if (response.status === 200) {
          setShipperData(response.data);
        } else {
          throw new Error("Shipper not found");
        }
      } catch (error) {
        console.error("Error fetching shipper:", error);
        message.error(`Failed to fetch shipper details: ${error.message}`);
      }
    };

    fetchShipper();
  }, [shipperId]);

  const handleSaveChanges = async () => {
    try {
      const updatedData = { ...shipperData };
      delete updatedData._id;
      const response = await axios.put(
        `http://localhost:5000/api/Shippers/${shipperId}`,
        updatedData
      );
      if (response.status === 200) {
        message.success("Shipper updated successfully!");
        setIsEditing(false);
        navigate("/dashboard/shipper-lists");
      } else {
        message.error("Failed to update shipper. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error updating shipper:",
        error.response?.data || error.message
      );
      message.error("Failed to update shipper. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/dashboard/shipper-lists"); // Navigate back to the shippers list
  };

  const handleChange = (field, value) => {
    setShipperData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!shipperData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Edit Shipper
        </Title>
      </Header>
      <Content
        style={{
          padding: "20px",
          backgroundColor: "#f0f2f5",
          paddingTop: "30px",
        }}
      >
        <Row justify="center" align="middle">
          <Col xs={22} sm={20} md={16} lg={12} xl={10}>
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Form layout="vertical">
                <Form.Item label="Shipper Name">
                  <Input
                    value={shipperData.shipperName}
                    onChange={(e) =>
                      handleChange("shipperName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Company Name">
                  <Input
                    value={shipperData.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line 1">
                  <Input
                    value={shipperData.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line 2">
                  <Input
                    value={shipperData.addressLine2}
                    onChange={(e) =>
                      handleChange("addressLine2", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line 3">
                  <Input
                    value={shipperData.addressLine3}
                    onChange={(e) =>
                      handleChange("addressLine3", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Mobile Number">
                  <Input
                    value={shipperData.mobileNumber}
                    onChange={(e) =>
                      handleChange("mobileNumber", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Row justify="center" gutter={16}>
                  {!isEditing ? (
                    <Button type="primary" onClick={() => setIsEditing(true)}>
                      Edit Shipper
                    </Button>
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
              </Form>
            </div>
          </Col>
        </Row>
        <div
          style={{ display: "flex", justifyContent: "end", }}
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

export default EditShipper;
