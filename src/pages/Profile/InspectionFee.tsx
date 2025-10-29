import {
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Image,
  message,
  Pagination,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar.tsx";

const { Title, Paragraph } = Typography;

interface InspectionFeeItem {
  inspectionFeesId: number;
  description: string;
  feeAmount: number;
  currency: string;
  type: string;
  inspectionDays: number;
}

interface InspectionFeeApiResponse {
  message: string;
  isSuccess: boolean;
  result: {
    items: InspectionFeeItem[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const InspectionFee = () => {
  const [inspectionFees, setInspectionFees] = useState<InspectionFeeItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFees, setTotalFees] = useState(0);
  const pageSize = 3; // As per the API request example

  const fetchInspectionFees = async (page: number) => {
    try {
      const response = await fetch(
        `https://localhost:7000/GetAllInspectionFees?Page=${page}&PageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: InspectionFeeApiResponse = await response.json();

      if (data.isSuccess) {
        setInspectionFees(data.result.items);
        setTotalFees(data.result.totalItems);
        setCurrentPage(data.result.page);
      } else {
        message.error(data.message || "Failed to fetch inspection fees.");
      }
    } catch (error) {
      console.error("Error fetching inspection fees:", error);
      message.error(
        "Error fetching inspection fees: Could not connect to the server."
      );
    }
  };

  useEffect(() => {
    fetchInspectionFees(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <Title level={2} className="mb-5 text-gray-800 flex items-center">
              <InfoCircleOutlined className="mr-2" /> Inspection Fees
            </Title>
            <Paragraph type="secondary" className="mb-6">
              Explore available inspection packages and their details.
            </Paragraph>

            <Row gutter={[24, 24]} className="mb-6">
              {inspectionFees.length > 0 ? (
                inspectionFees.map((fee) => (
                  <Col xs={24} key={fee.inspectionFeesId}>
                    <Card
                      hoverable
                      className="w-full rounded-lg overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      <Row gutter={0}>
                        <Col span={8}>
                          <div className="h-full">
                            {/* Placeholder Image for Inspection Type */}
                            <Image
                              alt={`${fee.type} inspection`}
                              src="https://via.placeholder.com/300x200.png?text=Inspection+Image" // Placeholder image
                              className="w-full h-full object-cover"
                              style={{ maxHeight: 200 }}
                            />
                          </div>
                        </Col>
                        <Col span={16}>
                          <div className="p-4">
                            <Title level={4} className="mt-0 mb-2">
                              {fee.type} Inspection
                            </Title>
                            <Paragraph className="text-gray-600 mb-3">
                              {fee.description}
                            </Paragraph>
                            <Space wrap className="mb-3">
                              <Tag icon={<CalendarOutlined />}>
                                {fee.inspectionDays} day(s) inspection
                              </Tag>
                              <Tag
                                icon={<CheckCircleOutlined />}
                                color="success"
                              >
                                Available
                              </Tag>
                            </Space>
                            <div className="flex justify-between items-center mt-4">
                              <Title level={3} className="text-green-600 mb-0">
                                <DollarOutlined />{" "}
                                {fee.feeAmount.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: fee.currency,
                                })}
                              </Title>
                              <Space>
                                {/* Example button, adjust as needed */}
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/ViewInspectionFee/${fee.inspectionFeesId}`
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                                <Button type="primary">Schedule</Button>
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
                  <Paragraph>No inspection fees found.</Paragraph>
                  <Button type="primary" icon={<InfoCircleOutlined />}>
                    Refresh Fees
                  </Button>
                </Col>
              )}
            </Row>

            {totalFees > pageSize && (
              <div className="text-center mt-8">
                <Pagination
                  current={currentPage}
                  total={totalFees}
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

export default InspectionFee;
