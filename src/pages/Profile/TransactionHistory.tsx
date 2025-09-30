import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const TransactionHistory = () => {
  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <Paragraph>Transaction History</Paragraph>
    </div>
  );
};

export default TransactionHistory;
