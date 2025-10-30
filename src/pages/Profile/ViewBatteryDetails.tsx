import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Image, Row, Spin, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";

const { Title, Paragraph } = Typography;

interface BatteryDetail {
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
  createdAt: string | null;
  updatedAt: string | null;
  status: "Active" | "Deleted";
  imageUrl: string;
}

const ViewBatteryDetails = () => {
  const { userId, batteryId } = useParams<{
    userId: string;
    batteryId: string;
  }>();
  const [battery, setBattery] = useState<BatteryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatteryDetails = async () => {
      try {
        const res = await fetch(
          `https://localhost:7000/UserViewBatteryDetail/${userId}/${batteryId}`
        );

        if (!res.ok) throw new Error("Failed to fetch battery details");

        const data = await res.json();
        if (data.isSuccess) {
          setBattery(data.result);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("Error fetching battery details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatteryDetails();
  }, [userId, batteryId]);

  const getStatusTag = (status: "Active" | "Deleted") =>
    status === "Active" ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Active
      </Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Deleted
      </Tag>
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Paragraph>No battery details found.</Paragraph>
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
            {/* Title */}
            <Title level={2} className="mb-5 flex items-center text-gray-800">
              <ThunderboltOutlined className="mr-2" /> {battery.brand} —{" "}
              {battery.batteryName}
            </Title>

            <Paragraph type="secondary" className="mb-6">
              {battery.description}
            </Paragraph>

            {/* Images */}
            <div className="flex gap-2 mb-6">
              <Image
                src={battery.imageUrl}
                alt="Battery"
                className="rounded-lg"
              />
              {/* <div className="flex flex-col gap-2">
                <Image src="https://via.placeholder.com/100.png?text=Side" />
                <Image src="https://via.placeholder.com/100.png?text=Top" />
                <Image src="https://via.placeholder.com/100.png?text=Specs" />
              </div> */}
            </div>

            {/* Price & Status */}
            <Card className="mb-6 p-4">
              <Title level={3} className="text-green-600 mb-2">
                <DollarOutlined />{" "}
                {battery.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: battery.currency,
                })}
              </Title>
              {getStatusTag(battery.status)}
            </Card>

            {/* Specifications */}
            <Card title="Battery Specifications" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Paragraph>
                    <strong>Brand:</strong> {battery.brand}
                  </Paragraph>
                  <Paragraph>
                    <strong>Capacity:</strong> {battery.capacity} kWh
                  </Paragraph>
                  <Paragraph>
                    <strong>Voltage:</strong> {battery.voltage} V
                  </Paragraph>
                  <Paragraph>
                    <strong>Warranty:</strong> {battery.warrantyMonths} months
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph>
                    <ThunderboltOutlined /> <strong>Status:</strong>{" "}
                    {getStatusTag(battery.status)}
                  </Paragraph>
                  <Paragraph>
                    <FieldTimeOutlined /> <strong>Created At:</strong>{" "}
                    {battery.createdAt
                      ? new Date(battery.createdAt).toLocaleString()
                      : "N/A"}
                  </Paragraph>
                  <Paragraph>
                    <FieldTimeOutlined /> <strong>Updated At:</strong>{" "}
                    {battery.updatedAt
                      ? new Date(battery.updatedAt).toLocaleString()
                      : "N/A"}
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewBatteryDetails;
