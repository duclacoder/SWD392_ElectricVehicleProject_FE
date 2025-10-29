import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Descriptions, Image, Modal, Tag } from "antd";
import type { FC } from "react";
import type { UserPostCustom } from "../../entities/UserPost";

interface UserPostDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  userPost: UserPostCustom | null;
}

export const UserPostDetailModal: FC<UserPostDetailModalProps> = ({
  visible,
  onCancel,
  userPost,
}) => {
  if (!userPost) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "pending":
        return "blue";
      case "rejected":
        return "red";
      case "expired":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleOutlined />;
      case "rejected":
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="User Post Details"
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Post ID" span={1}>
          <strong>{userPost.userPostId}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="User Name" span={1}>
          <strong>{userPost.userName}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Title" span={2}>
          <strong>{userPost.title}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Description" span={2}>
          {userPost.description}
        </Descriptions.Item>

        <Descriptions.Item label="Status" span={1}>
          <Tag
            color={getStatusColor(userPost.status)}
            icon={getStatusIcon(userPost.status)}
          >
            {userPost.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At" span={1}>
          {userPost.createdAt
            ? new Date(userPost.createdAt).toLocaleString()
            : "N/A"}
        </Descriptions.Item>

        {userPost.vehicle && (
          <>
            <Descriptions.Item label="Vehicle Brand" span={1}>
              {userPost.vehicle.brand || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Model" span={1}>
              {userPost.vehicle.model || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Year" span={1}>
              {userPost.vehicle.year}
            </Descriptions.Item>
            <Descriptions.Item label="Color" span={1}>
              {userPost.vehicle.color || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Price" span={1}>
              <strong style={{ color: "#52c41a" }}>
                {userPost.vehicle.price?.toLocaleString()} VND
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Body Type" span={1}>
              {userPost.vehicle.bodyType || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Range (km)" span={1}>
              {userPost.vehicle.rangeKm?.toLocaleString()} km
            </Descriptions.Item>
            <Descriptions.Item label="Motor Power (kW)" span={1}>
              {userPost.vehicle.motorPowerKw} kW
            </Descriptions.Item>

            <Descriptions.Item label="Vehicle Description" span={2}>
              {userPost.vehicle.description || "No description"}
            </Descriptions.Item>

            <Descriptions.Item label="Vehicle Status" span={1}>
              <Tag color={getStatusColor(userPost.vehicle.status)}>
                {userPost.vehicle.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Created At" span={1}>
              {userPost.vehicle.createdAt
                ? new Date(userPost.vehicle.createdAt).toLocaleString()
                : "N/A"}
            </Descriptions.Item>
          </>
        )}

        {userPost.images && userPost.images.length > 0 && (
          <Descriptions.Item label="Images" span={2}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Image.PreviewGroup>
                {userPost.images.map((imageUrl, index) => (
                  <Image
                    key={index}
                    width={100}
                    height={100}
                    src={imageUrl}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};
