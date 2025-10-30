import React, { useState } from "react";
import { Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { createUserPost } from "../../features/Post";
import type { CreateUserPostDTO } from "../../entities/UserPost";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VehiclePostForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadProps = {
    fileList,
    multiple: true,
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được tải ảnh!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file: any) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    listType: "picture-card" as const,
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Vui lòng đăng nhập!");
        return;
      }

      const postData: CreateUserPostDTO = {
        userId: parseInt(userId),
        title: values.title || `${values.vehicleBrand} ${values.vehicleModel}`,
        userPackageId: 1,
        year: values.vehicleYear,
        vehicle: {
          brand: values.vehicleBrand,
          model: values.vehicleModel,
          year: values.vehicleYear,
          color: values.vehicleColor,
          price: values.vehiclePrice,
          description: values.vehicleDescription,
          bodyType: values.vehicleBodyType,
          rangeKm: values.vehicleRangeKm,
          motorPowerKw: values.vehicleMotorPowerKw,
        },
      };

      const imageFiles = fileList.map((f) => f.originFileObj || f);
      await createUserPost(postData, imageFiles);
      message.success("Đăng bài thành công!");
      form.resetFields();
      setFileList([]);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi đăng bài!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="vehicleBrand" label="Hãng xe" rules={[{ required: true }]}>
        <Input placeholder="Tesla, Toyota..." />
      </Form.Item>
      <Form.Item name="vehicleModel" label="Mẫu xe" rules={[{ required: true }]}>
        <Input placeholder="Model 3, Camry..." />
      </Form.Item>
      <Form.Item name="vehicleYear" label="Năm sản xuất" rules={[{ required: true }]}>
        <InputNumber min={1900} max={new Date().getFullYear()} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="vehiclePrice" label="Giá bán (VNĐ)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="vehicleDescription" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Hình ảnh">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<CheckCircleOutlined />}
        >
          Đăng bài
        </Button>
      </div>
    </Form>
  );
};

export default VehiclePostForm;
