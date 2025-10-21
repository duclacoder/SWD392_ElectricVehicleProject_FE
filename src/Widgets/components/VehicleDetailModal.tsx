import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Badge, Descriptions, Modal, Tag } from "antd";
import type { FC } from "react";
import type { AdminVehicle } from "../../entities/AdminVehicle";

interface VehicleDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  vehicle: AdminVehicle | null;
}

export const VehicleDetailModal: FC<VehicleDetailModalProps> = ({
  visible,
  onCancel,
  vehicle,
}) => {
  if (!vehicle) return null;

  return (
    <Modal
      title="Vehicle Details"
      open={visible}
      onCancel={onCancel}
      footer={[
        <button
          key="close"
          onClick={onCancel}
          className="bg-sky-500 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-sky-600 transition"
        >
          Close
        </button>,
      ]}
      width={1000}
    >
      <Descriptions
        bordered
        column={2}
        layout="horizontal"
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px" }}
      >
        {/* Basic Info */}
        <Descriptions.Item label="Vehicle ID" span={1}>
          {vehicle.vehiclesId}
        </Descriptions.Item>
        <Descriptions.Item label="Owner (User ID)" span={1}>
          {vehicle.userId}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle Name" span={2}>
          {vehicle.vehicleName}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {vehicle.description}
        </Descriptions.Item>
        <Descriptions.Item label="Brand">{vehicle.brand}</Descriptions.Item>
        <Descriptions.Item label="Model">{vehicle.model}</Descriptions.Item>
        <Descriptions.Item label="Year">{vehicle.year}</Descriptions.Item>
        <Descriptions.Item label="Color">{vehicle.color}</Descriptions.Item>
        <Descriptions.Item label="Seats">{vehicle.seats}</Descriptions.Item>
        <Descriptions.Item label="Body Type">
          {vehicle.bodyType}
        </Descriptions.Item>
        <Descriptions.Item label="Odometer (km)">
          {vehicle.km.toLocaleString()} km
        </Descriptions.Item>
        <Descriptions.Item label="Warranty">
          {vehicle.warrantyMonths} months
        </Descriptions.Item>

        {/* EV Specs */}
        <Descriptions.Item label="Battery Capacity" span={1}>
          <Badge status="processing" text={`${vehicle.batteryCapacity} kWh`} />
        </Descriptions.Item>
        <Descriptions.Item label="Range" span={1}>
          {vehicle.rangeKm} km
        </Descriptions.Item>
        <Descriptions.Item label="Motor Power" span={1}>
          {vehicle.motorPowerKw} kW
        </Descriptions.Item>
        <Descriptions.Item label="Top Speed" span={1}>
          {vehicle.topSpeedKph} kph
        </Descriptions.Item>
        <Descriptions.Item label="Acceleration (0-100s)" span={1}>
          {vehicle.acceleration} s
        </Descriptions.Item>
        <Descriptions.Item label="Charging Time" span={1}>
          {vehicle.chargingTimeHours} hours
        </Descriptions.Item>
        <Descriptions.Item label="Fast Charging" span={1}>
          {vehicle.fastChargingSupport ? (
            <Tag color="green">Yes</Tag>
          ) : (
            <Tag color="red">No</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Connector Type" span={1}>
          {vehicle.connectorType}
        </Descriptions.Item>
        <Descriptions.Item label="Battery Status" span={2}>
          {vehicle.batteryStatus}
        </Descriptions.Item>

        {/* Pricing & Status */}
        <Descriptions.Item label="Price" span={1}>
          <Tag color="blue">
            {vehicle.price.toLocaleString()} {vehicle.currency}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={1}>
          <Tag color="purple">{vehicle.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Verified" span={2}>
          <Tag
            icon={
              vehicle.verified ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
            color={vehicle.verified ? "success" : "error"}
          >
            {vehicle.verified ? "Verified" : "Not Verified"}
          </Tag>
        </Descriptions.Item>

        {/* Timestamps */}
        <Descriptions.Item label="Created At" span={1}>
          {new Date(vehicle.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At" span={1}>
          {new Date(vehicle.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
