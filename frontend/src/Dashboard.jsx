import React, { useState, useEffect } from "react";
import { Layout, Menu,Typography } from "antd";
import {
  DashboardOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  CalculatorOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ListContext } from "rc-field-form";
const { Header} = Layout;
const { Title } = Typography;
const { Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 1023);
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuKeyFromPath = () => {
    const path = location.pathname;
    if (path.includes("create-new-invoice")) return "2";
    if (path.includes("invoice-lists")) return "3";
    if (path.includes("invoice-edit")) return "4";
    if (path.includes("invoice-view")) return "5";
    if (path.includes("add-shipper")) return "6";
    if (path.includes("shipper-lists")) return "7";
    if (path.includes("shipper-edit")) return "8";
    if (path.includes("shipper-view")) return "9";
    if (path.includes("add-consignee")) return "10";
    if (path.includes("consignee-lists")) return "11";
    if (path.includes("consignee-edit")) return "12";
    if (path.includes("consignee-view")) return "13";
    if (path.includes("gst-calculator")) return "14";
    return "1";
  };

  const handleMenuClick = ({ key }) => {
    const routes = {
      1: "/dashboard",
      2: "/dashboard/create-new-invoice",
      3: "/dashboard/invoice-lists",
      4: "/dashboard/invoice/edit/:id",
      5: "/dashboard/invoice/view/:id",
      6: "/dashboard/add-shipper",
      7: "/dashboard/shipper-lists",
      8: "/dashboard/shipper/edit/:id",
      9: "/dashboard/shipper/view/:id",
      10: "/dashboard/add-consignee",
      11: "/dashboard/consignee-lists",
      12: "/dashboard/consignee/edit/:id",
      13: "/dashboard/consignee/view/:id",
      14: "/dashboard/gst-calculator",
    };
    navigate(routes[key]);
  };

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          backgroundColor: "#fff",
          position: "fixed",
          height: "100vh",
          left: 0,
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getMenuKeyFromPath()]}
          onClick={handleMenuClick}
          style={{
            height: "100%",
            borderRight: 0,
          }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />}>
            Create Invoice
          </Menu.Item>
          <Menu.Item key="3" icon={<UnorderedListOutlined />}>
            Invoice Lists
          </Menu.Item>
          <Menu.Item key="6" icon={<TruckOutlined />}>
            Add Shipper
          </Menu.Item>
          <Menu.Item key="7" icon={<TruckOutlined />}>
            Shipper Lists
          </Menu.Item>
          <Menu.Item key="10" icon={<UserAddOutlined />}>
            Add Consignee
          </Menu.Item>
          <Menu.Item key="11" icon={<UserAddOutlined />}>
            Consignee Lists
          </Menu.Item>
          <Menu.Item key="14" icon={<CalculatorOutlined />}>
            GST Calculator
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 220 }}>
        <Content className="content" style={{ padding: '10px' }}>
        {location.pathname === "/dashboard" ? (
            <Header style={{ backgroundColor: "#001529", textAlign: "center" }}>
            <Title level={2} style={{ color: "white", margin: 0, padding: 10 }}>
            Invoice Management
            </Title>
          </Header>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
