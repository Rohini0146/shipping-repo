import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Typography, Layout, Popconfirm, message, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const { Header, Content } = Layout;
const { Title } = Typography;

const ConsigneeLists = () => {
  const [consignees, setConsignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/consignee");
        setConsignees(response.data);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsignees();
  }, []);


  const handleEdit = (id) => {
    navigate(`/dashboard/consignees/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/dashboard/consignees/view/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/consignee/${id}`);
      if (response.status === 200) {
        message.success("consignee deleted successfully");
        setConsignees((prev) => prev.filter((consignee) => consignee._id !== id));
      } else {
        message.error("Failed to delete consignee");
      }
    } catch (error) {
      console.error("Error deleting consignee:", error);
      message.error("Error deleting consignee");
    }
  };

  const columns = [
    {
      title: "Consignee Name",
      dataIndex: "consigneeName",
      key: "consigneeName",
    },
    {
      title: "Company Name",
      dataIndex: "companyNamee",
      key: "companyNamee",
    },
    {
      title: "Address Line 1",
      dataIndex: "addressLineOne",
      key: "addressLineOne",
    },
    {
      title: "Address Line 2",
      dataIndex: "addressLineTwo",
      key: "addressLineTwo",
    },
    {
      title: "Address Line 3",
      dataIndex: "addressLineThree",
      key: "addressLineThree",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNo",
      key: "mobileNo",
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
        Consignee Lists
        </Title>
      </Header>
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5", paddingTop:"30px"}}>
        
          <Card style={{padding:"0"}} className="consignee-table">
        <Table
          dataSource={consignees.map((consignee) => ({
            ...consignee,
            key: consignee._id,
          }))}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
          style={{padding:"0"}}
        />
        {consignees.length === 0 && !loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography.Text>No consignees available.</Typography.Text>
          </div>
        )}
      </Card>
      </Content>
    </Layout>
  );
};

export default ConsigneeLists;
