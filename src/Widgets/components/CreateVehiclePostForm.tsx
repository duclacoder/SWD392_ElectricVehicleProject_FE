import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { createUserPost } from "../../features/Post/index";
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
    // Using picture-card layout for better preview in modal
    listType: "picture-card" as const, 
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
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Vui lòng đăng nhập!");
        setLoading(false);
        return;
      }

      if (fileList.length === 0) {
        message.warning("Vui lòng tải lên ít nhất 1 ảnh xe!");
        setLoading(false);
        return;
      }

      // Format price before sending (remove commas if formatter was used)
      const rawPrice = typeof values.vehiclePrice === 'string'
        ? parseInt(values.vehiclePrice.replace(/,/g, ''), 10)
        : values.vehiclePrice;

      const postData: CreateUserPostDTO = {
        userId: parseInt(userId),
        title: values.title || `${values.vehicleBrand} ${values.vehicleModel}`,
        userPackageId: 1, // Assuming default package ID
        year: values.vehicleYear,
        vehicle: {
          brand: values.vehicleBrand,
          model: values.vehicleModel,
          year: values.vehicleYear,
          color: values.vehicleColor,
          price: rawPrice,
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
      message.error("Lỗi khi đăng bài! Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="p-4">
      <h4 className="text-lg font-bold mb-4 text-blue-600">Thông tin cơ bản</h4>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item name="vehicleBrand" label="Hãng xe" rules={[{ required: true, message: "Nhập hãng xe" }]}>
            <Input placeholder="Tesla, Toyota..." size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="vehicleModel" label="Mẫu xe" rules={[{ required: true, message: "Nhập mẫu xe" }]}>
            <Input placeholder="Model 3, Camry..." size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={8}>
          <Form.Item name="vehicleYear" label="Năm sản xuất" rules={[{ required: true, message: "Nhập năm" }]}>
            <InputNumber min={1900} max={new Date().getFullYear() + 1} style={{ width: "100%" }} size="large" placeholder="2024" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehicleColor" label="Màu sắc" rules={[{ required: true, message: "Nhập màu xe" }]}>
            <Input placeholder="Trắng, Đen..." size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehicleBodyType" label="Dòng xe" rules={[{ required: true, message: "Nhập dòng xe" }]}>
            <Input placeholder="Sedan, SUV..." size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!my-6">
        <h4 className="text-lg font-bold text-blue-600">Thông số kỹ thuật & Giá</h4>
      </Divider>
      
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item name="vehicleRangeKm" label="Quãng đường (km)" rules={[{ required: true, message: "Nhập quãng đường" }]}>
            <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="500" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehicleMotorPowerKw" label="Công suất (kW)" rules={[{ required: true, message: "Nhập công suất" }]}>
            <InputNumber min={0} style={{ width: "100%" }} size="large" placeholder="150" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="vehiclePrice" label="Giá bán (VNĐ)" rules={[{ required: true, message: "Nhập giá bán" }]}>
            <InputNumber 
              min={0} 
              style={{ width: "100%" }} 
              size="large"
              placeholder="1,000,000,000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="vehicleDescription" label="Mô tả chi tiết" rules={[{ required: true, message: "Nhập mô tả" }]}>
        <Input.TextArea rows={4} placeholder="Mô tả tình trạng xe, lý do bán..." />
      </Form.Item>

      <Form.Item label="Hình ảnh (Tối thiểu 1 ảnh)" className="mb-8">
        <Upload {...uploadProps}>
          <div className="text-center p-3">
            <UploadOutlined className="text-3xl mb-1 text-blue-600" />
            <div className="font-bold text-blue-900">Tải ảnh lên</div>
          </div>
        </Upload>
      </Form.Item>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button onClick={onCancel} size="large">Hủy</Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          icon={<CheckCircleOutlined />}
          style={{ background: "#0ea5e9", borderColor: "#0ea5e9" }}
        >
          Đăng bài
        </Button>
      </div>
    </Form>
  );
};

export default VehiclePostForm;
