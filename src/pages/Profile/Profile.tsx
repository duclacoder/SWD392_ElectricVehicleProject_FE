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
  // Removed Ant Design Layout and Menu components as their roles are replaced by HTML divs with Tailwind classes
} from "antd";
import { Header } from "../../Widgets/Headers/Header.tsx";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CrownOutlined,
  CarOutlined,
  LockOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";

const { Title, Paragraph } = Typography;
// Removed { Sider, Content } from Layout; as they are no longer used

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
  const [backupProfile, setBackupProfile] = useState<UserProfile | null>(null);
  // Removed 'collapsed' state as the Sider is no longer collapsible
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile"); // State to track selected menu item

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

  const changePasswordAPI = async (oldPass: string, newPass: string) => {
    console.log("Changing password:", { oldPass, newPass });
    message.success("Password changed successfully (mock API).");
  };

  if (!userProfile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center p-5">
          <div className="max-w-2xl text-center">
            <Title level={2}>Loading Profile...</Title>
            <Paragraph>Attempting to retrieve user data.</Paragraph>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasValidImage =
    userProfile.imageUrl && userProfile.imageUrl.startsWith("http");

  // Helper function to render a menu item div with Tailwind styles
  const renderMenuItem = (
    key: string,
    icon: React.ReactNode,
    label: string
  ) => (
    <div
      key={key}
      className={`flex items-center p-3 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
        selectedMenuItem === key ? "bg-blue-600 font-bold" : ""
      }`}
      onClick={() => {
        setSelectedMenuItem(key);
        console.log("Selected menu item:", key);
        // In a real application, you would change content or navigate here
      }}
    >
      <span className="mr-3 text-xl">{icon}</span>{" "}
      {/* Ant Design icons may need slight sizing adjustments for consistency */}
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <div className="w-[250px] bg-[#001529] shadow-lg flex-shrink-0">
          <div className="logo p-4 text-white text-xl font-bold">Menu</div>
          <nav>
            {renderMenuItem("profile", <UserOutlined />, "Profile")}
            {renderMenuItem("view-car", <CarOutlined />, "View Car")}
            {renderMenuItem(
              "view-battery",
              <ThunderboltOutlined />,
              "View Battery"
            )}
            {renderMenuItem(
              "transaction-history",
              <HistoryOutlined />,
              "Transaction History"
            )}
          </nav>
        </div>
        {/* Main Content Area (formerly Content) */}
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div
            className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto" // Tailwind classes for the inner content wrapper
          >
            {selectedMenuItem === "profile" && (
              <>
                <Title level={2} className="mb-5 text-gray-800">
                  User Profile
                </Title>
                <Card
                  className="mt-5 rounded-lg overflow-visible" // Added Tailwind classes
                >
                  <div
                    className="bg-[#001529] h-[120px] rounded-t-lg mb-[-40px]" // Tailwind classes for the blue banner
                  ></div>

                  <div
                    className="text-center relative z-10 mt-[-40px] mb-5" // Tailwind classes for avatar container
                  >
                    {hasValidImage ? (
                      <Avatar
                        size={80}
                        src={userProfile.imageUrl}
                        className="border-4 border-white" // Tailwind for border
                      />
                    ) : (
                      <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor: "#87d068",
                          border: "3px solid white",
                        }}
                        className="bg-green-500 border-4 border-white" // Tailwind for background and border
                      />
                    )}
                    <Title
                      level={4}
                      className="text-gray-800 mt-2 mb-0" // Tailwind classes
                    >
                      {userProfile.fullName}
                    </Title>
                    <Paragraph
                      type="secondary"
                      className="mt-0 mb-2 text-gray-600" // Tailwind classes
                    >
                      @{userProfile.userName}
                    </Paragraph>
                    <Tag
                      color={
                        userProfile.role === "Admin" ? "geekblue" : "green"
                      }
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
                            setUserProfile({
                              ...userProfile,
                              email: e.target.value,
                            })
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
                            setUserProfile({
                              ...userProfile,
                              userName: e.target.value,
                            })
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
                            setUserProfile({
                              ...userProfile,
                              fullName: e.target.value,
                            })
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
                            setUserProfile({
                              ...userProfile,
                              phone: e.target.value,
                            })
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

                  <div className="mt-5 text-center flex justify-center gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          type="primary"
                          onClick={() => {
                            updateProfileAPI(userProfile);
                            setIsEditing(false);
                          }}
                          className="mr-3" // Tailwind for margin-right
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => {
                            if (backupProfile) setUserProfile(backupProfile);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          onClick={() => {
                            setBackupProfile({ ...userProfile });
                            setIsEditing(true);
                          }}
                          className="mr-3" // Tailwind for margin-right
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
              </>
            )}

            {/* Placeholder for other sections */}
            {selectedMenuItem === "view-car" && (
              <Title level={3}>View Car Details (Coming Soon)</Title>
            )}
            {selectedMenuItem === "view-battery" && (
              <Title level={3}>View Battery Details (Coming Soon)</Title>
            )}
            {selectedMenuItem === "transaction-history" && (
              <Title level={3}>Transaction History (Coming Soon)</Title>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default ProfilePage;
