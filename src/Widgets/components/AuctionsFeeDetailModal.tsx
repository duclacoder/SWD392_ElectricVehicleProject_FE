import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal, Tag } from "antd";
import type { FC } from "react";
import type { AuctionsFee } from "../../entities/AuctionsFee";

interface AuctionsFeeDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  fee: AuctionsFee | null;
}

export const AuctionsFeeDetailModal: FC<AuctionsFeeDetailModalProps> = ({
  visible,
  onCancel,
  fee,
}) => {
  if (!fee) return null;

  const getStatusTag = (status: string) => {
    const isInactive = status?.toLowerCase() === "inactive";
    return (
      <Tag
        icon={isInactive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
        color={isInactive ? "error" : "success"}
      >
        {isInactive ? "Inactive" : "Active"}
      </Tag>
    );
  };

  return (
    <Modal
      title="Auctions Fee Details"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel} type="primary">
          Close
        </Button>,
      ]}
      width={800}
    >
      <Descriptions
        bordered
        column={1}
        layout="horizontal"
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px" }}
      >
        <Descriptions.Item label="Fee ID">
          {fee.auctionsFeeId}
        </Descriptions.Item>
        <Descriptions.Item label="Type">{fee.type}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {fee.description}
        </Descriptions.Item>
        <Descriptions.Item label="Entry Fee">
          <Tag color="blue">
            {fee.entryFee.toLocaleString()} {fee.currency}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Fee Per Minute">
          <Tag color="geekblue">
            {fee.feePerMinute.toLocaleString()} {fee.currency}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {getStatusTag(fee.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {fee.createdAt ? new Date(fee.createdAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {new Date(fee.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
