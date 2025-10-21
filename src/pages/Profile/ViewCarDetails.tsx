import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Image, Row, Spin, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";

const { Title, Paragraph } = Typography;

interface CarDetail {
  vehiclesId: number;
  userId: number;
  vehicleName: string;
  description: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  batteryCapacity: number;
  rangeKm: number;
  chargingTimeHours: number;
  fastChargingSupport: boolean;
  motorPowerKw: number;
  topSpeedKph: number;
  acceleration: number;
  connectorType: string;
  year: number;
  km: number;
  batteryStatus: string;
  warrantyMonths: number;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  status: "Pending" | "Approved" | "Rejected";
}

const ViewCarDetails = () => {
  const { userId, vehicleId } = useParams<{
    userId: string;
    vehicleId: string;
  }>();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `https://localhost:7000/UserViewCarDetail/${userId}/${vehicleId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.isSuccess) {
          setCar(data.result);
        } else {
          message.error(data.message || "Failed to fetch car details.");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [userId, vehicleId]);

  const getStatusTag = (status: "Pending" | "Approved" | "Rejected") => {
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
      default:
        return <Tag>{status}</Tag>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Paragraph>No car details found.</Paragraph>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <Title level={2} className="mb-5 text-gray-800 flex items-center">
              <CarOutlined className="mr-2" /> {car.year} {car.brand}{" "}
              {car.model}
            </Title>
            <Paragraph type="secondary" className="mb-6">
              {car.vehicleName} — {car.description}
            </Paragraph>

            {/* Car Images */}
            <div className="flex gap-2 mb-6">
              <Image
                src="https://via.placeholder.com/500x300.png?text=Main+Car+Image"
                alt="Car main"
                className="rounded-lg"
              />
              <div className="flex flex-col gap-2">
                <Image src="https://via.placeholder.com/100.png?text=Side" />
                <Image src="https://via.placeholder.com/100.png?text=Back" />
                <Image src="https://via.placeholder.com/100.png?text=Interior" />
              </div>
            </div>

            {/* Price and Status */}
            <Card className="mb-6 p-4">
              <Title level={3} className="text-green-600 mb-2">
                <DollarOutlined />{" "}
                {car.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: car.currency,
                })}
              </Title>
              {getStatusTag(car.status)}{" "}
              <Tag color={car.verified ? "green" : "red"}>
                {car.verified ? "Verified" : "Not Verified"}
              </Tag>
            </Card>

            {/* Technical Specs */}
            <Card title="Specifications" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Paragraph>
                    <strong>Color:</strong> {car.color}
                  </Paragraph>
                  <Paragraph>
                    <strong>Seats:</strong> {car.seats}
                  </Paragraph>
                  <Paragraph>
                    <strong>Body Type:</strong> {car.bodyType}
                  </Paragraph>
                  <Paragraph>
                    <strong>Battery Capacity:</strong> {car.batteryCapacity} kWh
                  </Paragraph>
                  <Paragraph>
                    <strong>Range:</strong> {car.rangeKm} km
                  </Paragraph>
                  <Paragraph>
                    <strong>Charging Time:</strong> {car.chargingTimeHours}{" "}
                    hours
                  </Paragraph>
                  <Paragraph>
                    <strong>Fast Charging:</strong>{" "}
                    {car.fastChargingSupport ? "Yes" : "No"}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph>
                    <ThunderboltOutlined /> <strong>Motor Power:</strong>{" "}
                    {car.motorPowerKw} kW
                  </Paragraph>
                  <Paragraph>
                    <RocketOutlined /> <strong>Top Speed:</strong>{" "}
                    {car.topSpeedKph} km/h
                  </Paragraph>
                  <Paragraph>
                    <FieldTimeOutlined /> <strong>Acceleration:</strong>{" "}
                    {car.acceleration} sec (0-100km/h)
                  </Paragraph>
                  <Paragraph>
                    <strong>Connector Type:</strong> {car.connectorType}
                  </Paragraph>
                  <Paragraph>
                    <strong>Odometer:</strong> {car.km.toLocaleString()} km
                  </Paragraph>
                  <Paragraph>
                    <strong>Battery Status:</strong> {car.batteryStatus}
                  </Paragraph>
                  <Paragraph>
                    <strong>Warranty:</strong> {car.warrantyMonths} months
                  </Paragraph>
                </Col>
              </Row>
            </Card>

            {/* Metadata */}
            <Card title="Listing Info">
              <Paragraph>
                <strong>Created At:</strong>{" "}
                {new Date(car.createdAt).toLocaleString()}
              </Paragraph>
              <Paragraph>
                <strong>Updated At:</strong>{" "}
                {new Date(car.updatedAt).toLocaleString()}
              </Paragraph>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCarDetails;
