import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const ShipperLists = () => {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shippers");
        setShippers(response.data);
      } catch (error) {
        console.error("Error fetching shippers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);

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
      title: "Address Line 1",
      dataIndex: "addressLine1",
      key: "addressLine1",
    },
    {
      title: "Address Line 2",
      dataIndex: "addressLine2",
      key: "addressLine2",
    },
    {
      title: "Address Line 3",
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={`/shippers/edit/${record._id}`}>
            <Button type="primary">Edit</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          <Col>
            <Title level={2}>Shipper List</Title>
          </Col>
          <Col>
            <Link to={`/add-shipper`}>
              <Button type="primary">Add New Shipper</Button>
            </Link>
          </Col>
        </Row>
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
    </div>
  );
};

export default ShipperLists;
