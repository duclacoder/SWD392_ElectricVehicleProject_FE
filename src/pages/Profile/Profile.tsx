import {
  Typography,
  Card,
  Avatar,
  Descriptions,
  Space,
  Tag,
  Input,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import { Header } from "../../Widgets/Headers/Header.tsx";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CrownOutlined,
  CarOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";

const { Title, Paragraph } = Typography;

interface UserProfile {
  userName: string;
  fullName: string;
  email: string;
  role: string;
  userId: string;
  imageUrl: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://localhost:7000/GetUserById/3");
        const data = await response.json();

        if (data.isSuccess && data.result) {
          const user = data.result;
          setUserProfile({
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            role: user.roleName,
            userId: user.usersId.toString(),
            imageUrl: user.imageUrl,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            status: user.status,
          });
        } else {
          message.error("Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error("Error fetching profile");
      }
    };

    fetchUserProfile();
  }, []);

  // Placeholder Update Profile API
  // Update Profile API
  const updateProfileAPI = async (data: UserProfile) => {
    try {
      const response = await fetch("https://localhost:7000/UpdateUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify({
          id: Number(data.userId),
          userName: data.userName,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        }),
      });

      const result = await response.json();

      if (result.isSuccess && result.result) {
        setUserProfile({
          userName: result.result.userName,
          fullName: result.result.fullName,
          email: result.result.email,
          role: result.result.roleName,
          userId: result.result.usersId.toString(),
          imageUrl: result.result.imageUrl,
          phone: result.result.phone,
          createdAt: result.result.createdAt,
          updatedAt: result.result.updatedAt,
          status: result.result.status,
        });
        message.success(result.message || "Profile updated successfully");
      } else {
        message.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error updating profile");
    }
  };

  // Placeholder Change Password API
  const changePasswordAPI = async (oldPass: string, newPass: string) => {
    console.log("Changing password:", { oldPass, newPass });
    message.success("Password changed successfully (mock API).");
  };

  if (!userProfile) {
    return (
      <>
        <Header />
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          <Title level={2}>Loading Profile...</Title>
          <Paragraph>Attempting to retrieve user data.</Paragraph>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Title level={2} style={{ marginBottom: "20px" }}>
          User Profile
        </Title>
        <Card
          style={{
            marginTop: "20px",
            borderRadius: "8px",
            overflow: "visible",
          }}
        >
          <div
            style={{
              backgroundColor: "#001529",
              height: "120px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              marginBottom: "-40px",
            }}
          ></div>

          <div
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              marginTop: -40,
              marginBottom: "20px",
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
            <Title
              level={4}
              style={{ color: "#333", marginTop: "10px", marginBottom: "0px" }}
            >
              {userProfile.fullName}
            </Title>
            <Paragraph
              type="secondary"
              style={{ marginTop: "0px", marginBottom: "8px" }}
            >
              @{userProfile.userName}
            </Paragraph>
            <Tag
              color={userProfile.role === "Admin" ? "geekblue" : "green"}
              icon={
                userProfile.role === "Admin" ? (
                  <CrownOutlined />
                ) : (
                  <CarOutlined />
                )
              }
            >
              {userProfile.role}
            </Tag>
          </div>

          {/* Editable fields */}
          <Descriptions bordered column={1} size="middle">
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
                  <MailOutlined /> Email
                </Space>
              }
            >
              {isEditing ? (
                <Input
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, email: e.target.value })
                  }
                />
              ) : (
                userProfile.email
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined /> Username
                </Space>
              }
            >
              {isEditing ? (
                <Input
                  value={userProfile.userName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, userName: e.target.value })
                  }
                />
              ) : (
                userProfile.userName
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> Full Name
                </Space>
              }
            >
              {isEditing ? (
                <Input
                  value={userProfile.fullName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, fullName: e.target.value })
                  }
                />
              ) : (
                userProfile.fullName
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> Phone
                </Space>
              }
            >
              {isEditing ? (
                <Input
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, phone: e.target.value })
                  }
                />
              ) : (
                userProfile.phone
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> Created At
                </Space>
              }
            >
              {userProfile.createdAt}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> Updated At
                </Space>
              }
            >
              {userProfile.updatedAt}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> Status
                </Space>
              }
            >
              {userProfile.status}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    updateProfileAPI(userProfile);
                    setIsEditing(false);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={() => setIsEditing(true)}
                  style={{ marginRight: "10px" }}
                >
                  Update Profile
                </Button>
                <Button
                  type="default"
                  icon={<LockOutlined />}
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onOk={() => {
          form.validateFields().then((values) => {
            changePasswordAPI(values.oldPassword, values.newPassword);
            setIsPasswordModalOpen(false);
            form.resetFields();
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[
              { required: true, message: "Please enter your old password" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Please enter a new password" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </>
  );
};

export default ProfilePage;
