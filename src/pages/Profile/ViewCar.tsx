import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar.tsx";
// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface Car {
  vehiclesId: number;
  userId: number;
  vehicleName: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  fastChargingSupport: boolean;
  year: number;
  km: number;
  warrantyMonths: number;
  price: number;
  currency: string;
  verified: boolean;
  status: "Pending" | "Approved" | "Rejected" | "Deleted"; // Explicitly define possible statuses
  imageUrl: string;
}

interface CarApiResponse {
  message: string;
  isSuccess: boolean;
  result: {
    items: Car[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const ViewCar = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const pageSize = 3; // As per the API request example

  const fetchCars = async (page: number) => {
    const currentUserId = localStorage.getItem("userId"); // Example: getting from localStorage

    if (!currentUserId) {
      message.error("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7000/GetAllCars?UserId=${currentUserId}&Page=${page}&PageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CarApiResponse = await response.json();

      if (data.isSuccess) {
        setCars(data.result.items);
        setTotalCars(data.result.totalItems);
        setCurrentPage(data.result.page);
      } else {
        message.error(data.message || "Failed to fetch cars.");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      message.error("Error fetching cars: Could not connect to the server.");
    }
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 🔹 Delete Car
  const handleDeleteCar = async (carId: number) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;

    try {
      const res = await fetch(
        `https://localhost:7000/DeleteCar?userId=${currentUserId}&carId=${carId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok && data.isSuccess) {
        message.success("Car deleted successfully.");
        fetchCars(currentPage);
      } else {
        message.error(data.message || "Failed to delete car.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Error deleting car.");
    }
  };

  // 🔹 Undelete Car
  const handleUnDeleteCar = async (carId: number) => {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) return;

    try {
      const res = await fetch(
        `https://localhost:7000/UnDeleteCar?userId=${currentUserId}&carId=${carId}`,
        { method: "PATCH" }
      );
      const data = await res.json();

      if (res.ok && data.isSuccess) {
        message.success("Car undeleted successfully.");
        fetchCars(currentPage);
      } else {
        message.error(data.message || "Failed to undelete car.");
      }
    } catch (err) {
      console.error("Undelete error:", err);
      message.error("Error undeleting car.");
    }
  };

  const navigate = useNavigate();

  const getStatusTag = (status: Car["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Approved
          </Tag>
        );
      case "Pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Pending
          </Tag>
        );
      case "Rejected":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Rejected
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
            <Title level={2} className="mb-5 text-gray-800 flex items-center">
              <CarOutlined className="mr-2" /> My Listed Cars
            </Title>
            <Paragraph type="secondary" className="mb-6">
              Manage your electric vehicle listings.
            </Paragraph>

            <Row gutter={[24, 24]} className="mb-6">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <Col xs={24} key={car.vehiclesId}>
                    <Card
                      hoverable
                      className="w-full rounded-lg overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      <Row gutter={0}>
                        <Col span={8}>
                          <div className="h-full">
                            {/* Placeholder Image */}
                            <Image
                              alt={`${car.brand} ${car.model}`}
                              src={`${car.imageUrl}`} // Placeholder image
                              className="w-full h-full object-cover"
                              style={{ maxHeight: 200 }}
                            />
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="p-4">
                            <Title level={4} className="mt-0 mb-2">
                              {car.year} {car.brand} {car.model}
                            </Title>
                            <Paragraph className="text-gray-600 mb-3">
                              {car.vehicleName}
                            </Paragraph>
                            <Space wrap className="mb-3">
                              <Tag icon={<DashboardOutlined />}>
                                {car.km.toLocaleString()} km
                              </Tag>
                              <Tag icon={<CalendarOutlined />}>
                                {car.warrantyMonths} months warranty
                              </Tag>
                              {getStatusTag(car.status)}
                            </Space>
                            <div className="flex justify-between items-center mt-4">
                              <Title level={3} className="text-green-600 mb-0">
                                <DollarOutlined />{" "}
                                {car.price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: car.currency,
                                })}
                              </Title>
                              <Space>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/ViewCarDetails/${car.userId}/${car.vehiclesId}`
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/UpdateCar/${car.userId}/${car.vehiclesId}`
                                    )
                                  }
                                  type="primary"
                                >
                                  Edit
                                </Button>

                                {/* 🔹 Delete / Undelete Button */}
                                {car.status?.toLowerCase() === "deleted" ? (
                                  <Popconfirm
                                    title="Are you sure to undelete this car?"
                                    onConfirm={() =>
                                      handleUnDeleteCar(car.vehiclesId)
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button icon={<RollbackOutlined />} danger>
                                      Undelete
                                    </Button>
                                  </Popconfirm>
                                ) : (
                                  <Popconfirm
                                    title="Are you sure to delete this car?"
                                    onConfirm={() =>
                                      handleDeleteCar(car.vehiclesId)
                                    }
                                    okText="Yes"
                                    cancelText="No"
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
                  <Paragraph>
                    No cars found. Start by adding a new one!
                  </Paragraph>
                  <Button type="primary" icon={<CarOutlined />}>
                    Add New Car
                  </Button>
                </Col>
              )}
            </Row>

            {totalCars > pageSize && (
              <div className="text-center mt-8">
                <Pagination
                  current={currentPage}
                  total={totalCars}
                  pageSize={pageSize}
                  onChange={handlePageChange}
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

export default ViewCar;
