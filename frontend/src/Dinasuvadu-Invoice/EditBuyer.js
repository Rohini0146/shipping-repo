import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Typography, Button, message, Row, Col } from "antd";
import axios from "axios";

const { Title } = Typography;

const EditBuyer = () => {
  const { id: buyerId } = useParams();
  const [buyerData, setBuyerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/buyers/${buyerId}`);
        setBuyerData(response.data);
      } catch (error) {
        console.error("Error fetching buyer:", error);
        message.error("Failed to fetch buyer details.");
      }
    };

    fetchBuyer();
  }, [buyerId]);


  

  const handleSaveChanges = async () => {
    try {
      const updatedData = { ...buyerData };
      delete updatedData._id;
      const response = await axios.put(`http://localhost:5000/api/buyers/${buyerId}`, updatedData);
      if (response.status === 200) {
        message.success("Buyer updated successfully!");
        setIsEditing(false);
        navigate("/buyer-lists");
      } else {
        message.error("Failed to update buyer. Please try again.");
      }
    } catch (error) {
      console.error("Error updating buyer:", error.response?.data || error.message);
      message.error("Failed to update buyer. Please try again.");
    }
  };


  const handleChange = (field, value) => {
    setBuyerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!buyerData) {
    return <div>Loading...</div>;
  }

  return (
    <Row justify="center" align="middle" >
      <Col xs={22} sm={20} md={16} lg={12} xl={10}>
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
            Edit Buyer Details
          </Title>
          <Form layout="vertical">
            <Form.Item label="Company Name">
              <Input
                value={buyerData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="GSTIN">
              <Input
                value={buyerData.gstin}
                onChange={(e) => handleChange("gstin", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Address Line 1">
              <Input
                value={buyerData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Address Line 2">
              <Input
                value={buyerData.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="City">
              <Input
                value={buyerData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="State">
              <Input
                value={buyerData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Form.Item label="Mobile Number">
              <Input
                value={buyerData.mNumber}
                onChange={(e) => handleChange("mNumber", e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
            <Row justify="center" gutter={16}>
              {!isEditing ? (
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  Edit Buyer
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
  );
};

export default EditBuyer;
