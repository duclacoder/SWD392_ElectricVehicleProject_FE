import {
  BgColorsOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  DollarOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  TagOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Image,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import type { FC } from "react";
import type { AdminVehicle } from "../../entities/AdminVehicle";

const { Title, Text, Paragraph } = Typography;

interface VehicleDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  vehicle: AdminVehicle | null;
}

const DetailItem: FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start mb-3">
    <span className="text-gray-500 mr-3 text-lg">{icon}</span>
    <div>
      <Text type="secondary" className="block text-xs uppercase tracking-wider">
        {label}
      </Text>
      <Text strong className="text-base text-gray-800">
        {value ?? "N/A"}
      </Text>
    </div>
  </div>
);

export const VehicleDetailModal: FC<VehicleDetailModalProps> = ({
  visible,
  onCancel,
  vehicle,
}) => {
  if (!vehicle) return null;

  const renderStatusTag = (status: string | undefined) => {
    let color = "default";
    switch (status?.toLowerCase()) {
      case "approved":
      case "admin":
        color = "success";
        break;
      case "pending":
        color = "processing";
        break;
      case "rejected":
      case "deleted":
        color = "error";
        break;
    }
    return status ? (
      <Tag color={color} className="font-medium">
        {status}
      </Tag>
    ) : (
      <Tag>Unknown</Tag>
    );
  };

  const renderVerifiedTag = (verified: boolean | undefined) => (
    <Tag
      icon={verified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      color={verified ? "success" : "error"}
      className="font-medium"
    >
      {verified ? "Verified" : "Not Verified"}
    </Tag>
  );

  return (
    <Modal
      title={
        <Space>
          <CarOutlined />
          <span className="font-semibold">
            {vehicle.vehicleName || "Vehicle Details"}
          </span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="close"
          type="primary"
          onClick={onCancel}
          className="rounded-lg"
        >
          Close
        </Button>,
      ]}
      width={900}
      styles={{
        body: { backgroundColor: "#f9fafb", padding: "24px" },
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10} className="text-center">
          <Image
            width="100%"
            src={
              vehicle.imageUrl ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={vehicle.vehicleName}
            style={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              objectFit: "cover",
              maxHeight: "300px",
            }}
            preview={{
              mask: (
                <Space>
                  <EyeOutlined />
                  Preview
                </Space>
              ),
            }}
          />
          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <DetailItem
              icon={<DollarOutlined />}
              label="Price"
              value={
                <Text strong className="text-2xl text-blue-600">
                  {vehicle.price?.toLocaleString() ?? "N/A"} {vehicle.currency}
                </Text>
              }
            />
            <Divider style={{ margin: "12px 0" }} />
            <Row>
              <Col span={12}>
                <DetailItem
                  icon={<TagOutlined />}
                  label="Status"
                  value={renderStatusTag(vehicle.status)}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<SafetyCertificateOutlined />}
                  label="Verified"
                  value={renderVerifiedTag(vehicle.verified)}
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs={24} md={14}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
            <Title level={4} className="mb-5 text-gray-700">
              Vehicle Information
            </Title>

            <Row gutter={[16, 0]}>
              {" "}
              <Col span={12}>
                <DetailItem
                  icon={<InfoCircleOutlined />}
                  label="Vehicle ID"
                  value={vehicle.vehiclesId}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<UserOutlined />}
                  label="Owner (User ID)"
                  value={vehicle.userId}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<CarOutlined />}
                  label="Brand"
                  value={vehicle.brand}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<CarOutlined />}
                  label="Model"
                  value={vehicle.model}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<CalendarOutlined />}
                  label="Year"
                  value={vehicle.year}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<BgColorsOutlined />}
                  label="Color"
                  value={vehicle.color}
                />
              </Col>{" "}
              {/* Added Color Icon */}
              <Col span={12}>
                <DetailItem
                  icon={<UsergroupAddOutlined />}
                  label="Seats"
                  value={vehicle.seats}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<CarOutlined />}
                  label="Body Type"
                  value={vehicle.bodyType || "N/A"}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<DashboardOutlined />}
                  label="Odometer"
                  value={`${vehicle.km?.toLocaleString()} km`}
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<SafetyCertificateOutlined />}
                  label="Warranty"
                  value={
                    vehicle.warrantyMonths != null
                      ? `${vehicle.warrantyMonths} months`
                      : "N/A"
                  }
                />
              </Col>
              <Col span={12}>
                <DetailItem
                  icon={<ThunderboltOutlined />}
                  label="Fast Charging"
                  value={
                    vehicle.fastChargingSupport ? (
                      <Tag color="green">Yes</Tag>
                    ) : (
                      <Tag color="red">No</Tag>
                    )
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
