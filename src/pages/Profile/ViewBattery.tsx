import {
  ThunderboltOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  DeleteOutlined,
  DollarOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Image,
  message,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Widgets/Headers/Header.tsx";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar.tsx";

const { Title, Paragraph } = Typography;

interface Battery {
  batteriesId: number;
  userId: number;
  batteryName: string;
  description: string;
  brand: string;
  capacity: number;
  voltage: number;
  warrantyMonths: number;
  price: number;
  currency: string;
  status: "Active" | "Deleted";
  imageUrl: string;
}

interface BatteryApiResponse {
  message: string;
  isSuccess: boolean;
  result: {
    items: Battery[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const ViewBattery = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBatteries, setTotalBatteries] = useState(0);
  const pageSize = 3;
  const navigate = useNavigate();

  const fetchBatteries = async (page: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      message.error("User ID not found.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7000/GetAllBattery?UserId=${userId}&Page=${page}&PageSize=${pageSize}`
      );
      const data: BatteryApiResponse = await res.json();

      if (res.ok && data.isSuccess) {
        setBatteries(data.result.items);
        setTotalBatteries(data.result.totalItems);
        setCurrentPage(data.result.page);
      } else {
        message.error(data.message || "Failed to load batteries.");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error while loading batteries.");
    }
  };

  useEffect(() => {
    fetchBatteries(currentPage);
  }, [currentPage]);

  const handleDelete = async (batteryId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(
        `https://localhost:7000/DeleteBattery?userId=${userId}&batteryId=${batteryId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        message.success("Battery deleted successfully.");
        fetchBatteries(currentPage);
      } else {
        message.error(data.message || "Failed to delete.");
      }
    } catch {
      message.error("Error deleting battery.");
    }
  };

  const handleUnDelete = async (batteryId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await fetch(
        `https://localhost:7000/UnDeleteBattery?userId=${userId}&batteryId=${batteryId}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        message.success("Battery restored.");
        fetchBatteries(currentPage);
      } else {
        message.error(data.message || "Failed to restore.");
      }
    } catch {
      message.error("Error restoring battery.");
    }
  };

  const getStatusTag = (status: Battery["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Active
          </Tag>
        );
      case "Deleted":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Deleted
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <Title level={2} className="mb-5 flex items-center text-gray-800">
              <ThunderboltOutlined className="mr-2" /> My Batteries
            </Title>
            <Paragraph type="secondary" className="mb-6">
              Manage your stored EV battery listings.
            </Paragraph>

            <Row gutter={[24, 24]} className="mb-6">
              {batteries.length > 0 ? (
                batteries.map((bat) => (
                  <Col xs={24} key={bat.batteriesId}>
                    <Card
                      hoverable
                      className="w-full rounded-lg"
                      bodyStyle={{ padding: 0 }}
                    >
                      <Row gutter={0}>
                        {/* ✅ Left - Placeholder Image like ViewCar */}
                        <Col span={8}>
                          <Image
                            alt="Battery Image"
                            src={bat.imageUrl}
                            className="w-full h-full object-cover"
                            style={{ maxHeight: 200 }}
                          />
                        </Col>

                        {/* ✅ Right - Details Section */}
                        <Col span={16}>
                          <div className="p-4">
                            <Title level={4} className="mt-0 mb-2">
                              {bat.brand} - {bat.batteryName}
                            </Title>
                            <Paragraph className="text-gray-600 mb-3">
                              {bat.description}
                            </Paragraph>

                            <Space wrap className="mb-3">
                              <Tag icon={<DashboardOutlined />}>
                                {bat.capacity} kWh / {bat.voltage}V
                              </Tag>
                              <Tag icon={<CalendarOutlined />}>
                                {bat.warrantyMonths} months warranty
                              </Tag>
                              {getStatusTag(bat.status)}
                            </Space>

                            <div className="flex justify-between items-center mt-4">
                              <Title level={3} className="text-green-600 mb-0">
                                <DollarOutlined />{" "}
                                {bat.price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: bat.currency,
                                })}
                              </Title>

                              <Space>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/ViewBatteryDetails/${bat.userId}/${bat.batteriesId}`
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    navigate(
                                      `/UpdateBattery/${bat.userId}/${bat.batteriesId}`
                                    )
                                  }
                                >
                                  Edit
                                </Button>

                                {bat.status === "Deleted" ? (
                                  <Popconfirm
                                    title="Are you sure to restore this battery?"
                                    onConfirm={() =>
                                      handleUnDelete(bat.batteriesId)
                                    }
                                  >
                                    <Button icon={<RollbackOutlined />} danger>
                                      Undelete
                                    </Button>
                                  </Popconfirm>
                                ) : (
                                  <Popconfirm
                                    title="Are you sure to delete this battery?"
                                    onConfirm={() =>
                                      handleDelete(bat.batteriesId)
                                    }
                                  >
                                    <Button icon={<DeleteOutlined />} danger>
                                      Delete
                                    </Button>
                                  </Popconfirm>
                                )}
                              </Space>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={24} className="text-center p-8">
                  <Paragraph>No batteries found. Add one now!</Paragraph>
                </Col>
              )}
            </Row>

            {totalBatteries > pageSize && (
              <div className="text-center mt-8">
                <Pagination
                  current={currentPage}
                  total={totalBatteries}
                  pageSize={pageSize}
                  onChange={(p) => setCurrentPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewBattery;
