import {
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Image, Row, Spin, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";

const { Title, Paragraph } = Typography;

interface InspectionFeeDetail {
  inspectionFeesId: number;
  description: string;
  feeAmount: number;
  currency: string;
  type: string;
  inspectionDays: number;
}

interface InspectionFeeDetailApiResponse {
  message: string;
  isSuccess: boolean;
  result: InspectionFeeDetail;
}

const ViewInspectionFee = () => {
  const { inspectionFeeId } = useParams<{ inspectionFeeId: string }>(); // Get the inspection fee ID from the URL
  const [inspectionFee, setInspectionFee] =
    useState<InspectionFeeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspectionFee = async () => {
      if (!inspectionFeeId) {
        message.error("Inspection fee ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7000/GetInspectionFeeById/${inspectionFeeId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: InspectionFeeDetailApiResponse = await response.json();
        if (data.isSuccess) {
          setInspectionFee(data.result);
        } else {
          message.error(
            data.message || "Failed to fetch inspection fee details."
          );
        }
      } catch (err) {
        console.error("Error fetching inspection fee details:", err);
        message.error(
          "Error fetching inspection fee details: Could not connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionFee();
  }, [inspectionFeeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!inspectionFee) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow">
          <UserSidebar />
          <div className="flex-grow p-6 bg-gray-100 overflow-auto">
            <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto text-center">
              <Paragraph>No inspection fee details found.</Paragraph>
            </div>
          </div>
        </div>
        <Footer />
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
              <InfoCircleOutlined className="mr-2" /> {inspectionFee.type}{" "}
              Inspection
            </Title>
            <Paragraph type="secondary" className="mb-6">
              Details for the {inspectionFee.type} inspection package.
            </Paragraph>

            {/* Inspection Image */}
            <div className="mb-6">
              <Image
                src="https://via.placeholder.com/600x400.png?text=Inspection+Detail+Image" // Placeholder image for detail view
                alt={`${inspectionFee.type} inspection`}
                className="rounded-lg w-full object-cover"
                style={{ maxHeight: 400 }}
              />
            </div>

            {/* Price Card */}
            <Card className="mb-6 p-4">
              <Title level={3} className="text-green-600 mb-2">
                <DollarOutlined />{" "}
                {inspectionFee.feeAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: inspectionFee.currency,
                })}
              </Title>
              <Tag icon={<CheckCircleOutlined />} color="success">
                Available
              </Tag>
            </Card>

            {/* Details Card */}
            <Card title="Package Details" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Paragraph>
                    <strong>Description:</strong> {inspectionFee.description}
                  </Paragraph>
                  <Paragraph>
                    <CalendarOutlined /> <strong>Inspection Duration:</strong>{" "}
                    {inspectionFee.inspectionDays} day(s)
                  </Paragraph>
                  <Paragraph>
                    <strong>Package Type:</strong> {inspectionFee.type}
                  </Paragraph>
                  <Paragraph>
                    <strong>Inspection ID:</strong>{" "}
                    {inspectionFee.inspectionFeesId}
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

export default ViewInspectionFee;
