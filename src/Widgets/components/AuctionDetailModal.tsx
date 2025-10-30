import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal, Tag } from "antd";
import type { FC } from "react";
import type { AuctionCustom } from "../../entities/Auction";

interface AuctionDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  auction: AuctionCustom | null;
}

export const AuctionDetailModal: FC<AuctionDetailModalProps> = ({
  visible,
  onCancel,
  auction,
}) => {
  if (!auction) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "scheduled":
        return "blue";
      case "completed":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return <CheckCircleOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Auction Details"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Auction ID" span={1}>
          <strong>{auction.auctionId}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={1}>
          <Tag
            color={getStatusColor(auction.status)}
            icon={getStatusIcon(auction.status)}
          >
            {auction.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Seller User Name" span={1}>
          {auction.sellerUserName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle ID" span={1}>
          {auction.vehicleId}
        </Descriptions.Item>

        <Descriptions.Item label="Start Price" span={1}>
          <strong style={{ color: "#52c41a" }}>
            {auction.startPrice?.toLocaleString()} VND
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="Entry Fee" span={1}>
          <strong style={{ color: "#1890ff" }}>
            {auction.entryFee?.toLocaleString()} VND
          </strong>
        </Descriptions.Item>

        <Descriptions.Item label="Fee Per Minute" span={1}>
          {auction.feePerMinute?.toLocaleString()} VND
        </Descriptions.Item>
        <Descriptions.Item label="Open Fee" span={1}>
          {auction.openFee?.toLocaleString()} VND
        </Descriptions.Item>

        <Descriptions.Item label="Start Time" span={1}>
          {auction.startTime
            ? new Date(auction.startTime).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="End Time" span={1}>
          {auction.endTime ? new Date(auction.endTime).toLocaleString() : "N/A"}
        </Descriptions.Item>

        {auction.auctionsFeeId && (
          <Descriptions.Item label="Auctions Fee ID" span={2}>
            {auction.auctionsFeeId}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Total Bids" span={2}>
          {auction.bids?.length || 0} bid(s)
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
