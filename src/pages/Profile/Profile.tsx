import { Typography, Card, Avatar, Descriptions, Space, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CrownOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

interface UserProfile {
  userName: string;
  fullName: string;
  email: string;
  role: string;
  userId: string;
  imageUrl: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userName = localStorage.getItem("userName") || "N/A";
    const fullName = localStorage.getItem("fullName") || "N/A";
    const email = localStorage.getItem("email") || "N/A";
    const role = localStorage.getItem("role") || "N/A";
    const userId = localStorage.getItem("userId") || "N/A";
    const imageUrl = localStorage.getItem("imageUrl") || ""; // Default to empty string if no image

    setUserProfile({ userName, fullName, email, role, userId, imageUrl });
  }, []);

  if (!userProfile) {
    return (
      <div style={{ padding: "20px" }}>
        <Title level={2}>Loading Profile...</Title>
        <Paragraph>Attempting to retrieve user data.</Paragraph>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>User Profile</Title>
      <Paragraph>
        Here you can view your personal details and account information.
      </Paragraph>

      <Card
        style={{ marginTop: "20px", borderRadius: "8px" }}
        cover={
          <div
            style={{
              backgroundColor: "#001529",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            {userProfile.imageUrl ? (
              <Avatar
                size={80}
                src={userProfile.imageUrl}
                style={{ border: "3px solid white" }}
              />
            ) : (
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#87d068",
                  border: "3px solid white",
                }}
              />
            )}
          </div>
        }
      >
        <div
          style={{
            textAlign: "center",
            marginTop: "-40px",
            marginBottom: "20px",
          }}
        >
          <Title level={4} style={{ color: "#333" }}>
            {userProfile.fullName}
          </Title>
          <Paragraph type="secondary" style={{ marginTop: "-10px" }}>
            @{userProfile.userName}
          </Paragraph>
          <Tag
            color={userProfile.role === "Admin" ? "geekblue" : "green"}
            icon={
              userProfile.role === "Admin" ? <CrownOutlined /> : <CarOutlined />
            }
          >
            {userProfile.role}
          </Tag>
        </div>

        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined /> Email
              </Space>
            }
          >
            {userProfile.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined /> User ID
              </Space>
            }
          >
            {userProfile.userId}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined /> Username
              </Space>
            }
          >
            {userProfile.userName}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined /> Full Name
              </Space>
            }
          >
            {userProfile.fullName}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Paragraph
        style={{ marginTop: "20px", textAlign: "center", color: "#888" }}
      >
        Manage your account settings from the sidebar.
      </Paragraph>
    </div>
  );
};

export default ProfilePage;
