import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const AdminDashboardPage = () => {
  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <Paragraph>
        Welcome to the admin panel. Please select an option from the sidebar.
      </Paragraph>
    </div>
  );
};

export default AdminDashboardPage;
