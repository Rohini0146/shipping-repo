import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Typography, Layout, Popconfirm, Space, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const { Header, Content } = Layout;
const { Title } = Typography;

const ShipperLists = () => {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Shippers");
        setShippers(response.data);
      } catch (error) {
        console.error("Error fetching shippers:", error); // Log error details
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);


  const handleEdit = (id) => {
    navigate(`/dashboard/shippers/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/dashboard/shippers/view/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/Shippers/${id}`);
      if (response.status === 200) {
        message.success("Shipper deleted successfully");
        setShippers((prev) => prev.filter((shipper) => shipper._id !== id));
      } else {
        message.error("Failed to delete Shipper");
      }
    } catch (error) {
      console.error("Error deleting Shipper:", error);
      message.error("Error deleting Shipper");
    }
  };
  

  const columns = [
    {
      title: "Shipper Name",
      dataIndex: "shipperName",
      key: "shipperName",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Address One",
      dataIndex: "addressLine1",
      key: "addressLine1",
    },
    {
      title: "Address Two",
      dataIndex: "addressLine2",
      key: "addressLine2",
    },
    {
      title: "Address Three",
      dataIndex: "addressLine3",
      key: "addressLine3",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            type="link"
            icon={<EyeOutlined style={{ color: "blue" }}/>}
            onClick={() => handleView(record._id)}
          />
          <Button
            type="link"
            icon={<EditOutlined style={{ color: "green" }}/>}
            onClick={() => handleEdit(record._id)}
          />
         
          <Popconfirm
            title="Are you sure to delete this invoice?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
          Shipper Lists
        </Title>
      </Header>
      <Content
        style={{
          padding: "20px",
          backgroundColor: "#f0f2f5",
          paddingTop: "30px",
        }}
      >
        <Card style={{ padding: "0" }} className="consignee-table">
          <Table
            dataSource={shippers.map((shipper) => ({
              ...shipper,
              key: shipper._id,
            }))}
            columns={columns}
            pagination={{ pageSize: 5 }}
            loading={loading}
          />
          {shippers.length === 0 && !loading && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Typography.Text>No shippers available.</Typography.Text>
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default ShipperLists;
