import { Descriptions, Modal, Tag } from "antd";
import React from "react";
import type { PostPackage } from "../../../entities/PostPackage";

interface Props {
  open: boolean;
  onCancel: () => void;
  selectedItem: PostPackage | null;
}

const PostPackageDetailModal: React.FC<Props> = ({
  open,
  onCancel,
  selectedItem,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      title={
        <span style={{ fontSize: "18px", fontWeight: 600, color: "#1f1f1f" }}>
          Chi tiết gói bài đăng
        </span>
      }
      bodyStyle={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: "24px 28px",
      }}
    >
      {selectedItem ? (
        <Descriptions
          column={2}
          bordered
          labelStyle={{
            fontWeight: 600,
            color: "#595959",
            fontSize: "15px",
            background: "#fafafa",
            borderRight: "1px solid #f0f0f0",
            padding: "12px 16px",
          }}
          contentStyle={{
            fontSize: "15px",
            padding: "12px 16px",
            color: "#262626",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          <Descriptions.Item label="Tên gói">
            {selectedItem.packageName}
          </Descriptions.Item>

          <Descriptions.Item label="Giá">
            {selectedItem.postPrice.toLocaleString()} {selectedItem.currency}
          </Descriptions.Item>

          <Descriptions.Item label="Thời hạn">
            {selectedItem.postDuration} ngày
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {selectedItem.description || "Không có mô tả"}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" span={2}>
            <Tag
              style={{
                fontSize: "14px",
                padding: "4px 12px",
                borderRadius: 8,
                background:
                  selectedItem.status === "Active" ? "#f6ffed" : "#fff2f0",
                border:
                  selectedItem.status === "Active"
                    ? "1px solid #b7eb8f"
                    : "1px solid #ffa39e",
                color: selectedItem.status === "Active" ? "#389e0d" : "#cf1322",
              }}
            >
              {selectedItem.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </Modal>
  );
};

export default PostPackageDetailModal;
