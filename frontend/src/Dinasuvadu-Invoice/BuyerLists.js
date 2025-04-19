import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const BuyerLists = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/buyers");
        setBuyers(response.data);
      } catch (error) {
        console.error("Error fetching buyers:", error); // Log error details
      } finally {
        setLoading(false);
      }
    };
    

    fetchBuyers();
  }, []);

  const columns = [
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
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "GSTIN",
      dataIndex: "gstin",
      key: "gstin",
    },
    {
      title: "Mobile Number",
      dataIndex: "mNumber",
      key: "mNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={`/buyers/edit/${record._id}`}>
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
            <Title level={2}>Buyer List</Title>
          </Col>
          <Col>
            <Link to={`/add-buyer`}>
              <Button type="primary">Add New Buyer</Button>
            </Link>
          </Col>
        </Row>
        <Table
          dataSource={buyers.map((buyer) => ({
            ...buyer,
            key: buyer._id,
          }))}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
        {buyers.length === 0 && !loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Typography.Text>No buyers available.</Typography.Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BuyerLists;
