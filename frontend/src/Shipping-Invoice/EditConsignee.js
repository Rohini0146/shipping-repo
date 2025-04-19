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
import { FaArrowLeft } from "react-icons/fa";
const { Header, Content } = Layout;
const { Title } = Typography;

const EditConsignee = () => {
  const { id: consigneeId } = useParams();
  const [consigneeData, setConsigneeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsignee = async () => {
      try {
        // Check if consigneeId is valid
        if (!consigneeId) {
          throw new Error("Invalid Consignee ID");
        }
        const response = await axios.get(
          `http://localhost:5000/api/consignee/${consigneeId}`
        );
        if (response.status === 200) {
          setConsigneeData(response.data);
        } else {
          throw new Error("Consignee not found");
        }
      } catch (error) {
        console.error("Error fetching consignee:", error);
        message.error(`Failed to fetch consignee details: ${error.message}`);
      }
    };

    fetchConsignee();
  }, [consigneeId]);

  const handleSaveChanges = async () => {
    try {
      const updatedData = { ...consigneeData };
      delete updatedData._id;
      const response = await axios.put(
        `http://localhost:5000/api/consignee/${consigneeId}`,
        updatedData
      );
      if (response.status === 200) {
        message.success("Consignee updated successfully!");
        setIsEditing(false);
        navigate("/dashboard/consignee-lists");
      } else {
        message.error("Failed to update consignee. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error updating consignee:",
        error.response?.data || error.message
      );
      message.error("Failed to update consignee. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/dashboard/consignee-lists"); // Navigate back to the shippers list
  };

  const handleChange = (field, value) => {
    setConsigneeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!consigneeData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Edit Consignee
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
                <Form.Item label="Consignee Name">
                  <Input
                    value={consigneeData.consigneeName}
                    onChange={(e) =>
                      handleChange("consigneeName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Company Namee">
                  <Input
                    value={consigneeData.companyNamee}
                    onChange={(e) =>
                      handleChange("companyNamee", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line One">
                  <Input
                    value={consigneeData.addressLineOne}
                    onChange={(e) =>
                      handleChange("addressLineOne", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line Two">
                  <Input
                    value={consigneeData.addressLineTwo}
                    onChange={(e) =>
                      handleChange("addressLineTwo", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Address Line Three">
                  <Input
                    value={consigneeData.addressLineThree}
                    onChange={(e) =>
                      handleChange("addressLineThree", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Form.Item label="Mobile Number">
                  <Input
                    value={consigneeData.mobileNo}
                    onChange={(e) => handleChange("mobileNo", e.target.value)}
                    disabled={!isEditing}
                  />
                </Form.Item>
                <Row justify="center" gutter={16}>
                  {!isEditing ? (
                    <Button type="primary" onClick={() => setIsEditing(true)}>
                      Edit Consignee
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
        <div style={{ display: "flex", justifyContent: "end" }}>
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

export default EditConsignee;
