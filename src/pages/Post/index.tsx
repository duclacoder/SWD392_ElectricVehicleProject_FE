import {
  CarOutlined,
  CheckCircleOutlined,
  PictureOutlined,
  ThunderboltOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import type { CreateUserPostDTO } from "../../entities/UserPost";
import { createUserPost } from "../../features/Post";

const { Title, Text } = Typography;

const PostVehicleSale: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: { authorization: "authorization-text" },
    multiple: true,
    onChange(info: any) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} tải lên thành công`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại`);
      }
    },
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const postData: CreateUserPostDTO = {
        userName: "Admin",
        title: values.title,
        year: values.vehicleYear,
        packageName: values.packageName || "a",
        imageUrls: [],
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

      const result = await createUserPost(postData);
      if (result) {
        message.success("🎉 Bài đăng bán xe đã được tạo thành công!");
        form.resetFields();
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to create user post:", error);
      message.error("❌ Đã xảy ra lỗi khi đăng bài bán xe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section
        className="py-20 min-h-screen relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-cyan-200 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300 opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-2xl"
              style={{
                background: "white",
              }}
            >
              <CarOutlined className="text-6xl text-blue-600" />
            </div>
            <Title
              level={1}
              className="!mb-4 !text-white"
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              Đăng Bài Bán Xe
            </Title>
            <Text className="text-white text-xl opacity-95 font-medium block mb-8">
              Tạo bài đăng chuyên nghiệp, thu hút người mua chỉ trong vài phút
            </Text>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">⚡ Nhanh chóng</Text>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">✨ Dễ dàng</Text>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">🎯 Hiệu quả</Text>
              </div>
            </div>
          </div>

          <Card
            className="shadow-2xl border-0 overflow-hidden"
            style={{
              background: "white",
              borderRadius: "40px",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              className="p-4 sm:p-8"
            >
              {/* Thông tin cơ bản */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                  border: "3px solid #0ea5e9",
                }}
              >
                <Space align="center" className="mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <CarOutlined className="text-3xl text-white" />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 text-blue-900"
                    style={{ fontSize: "1.75rem", fontWeight: 700 }}
                  >
                    Thông tin cơ bản
                  </Title>
                </Space>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="vehicleBrand"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Hãng xe
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập hãng xe!" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Tesla, Toyota, VinFast..."
                        className="rounded-2xl h-14 text-base font-medium"
                        style={{
                          background: "white",
                          border: "2px solid #0ea5e9",
                          boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="vehicleModel"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Mẫu xe
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập mẫu xe!" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Model 3, Camry, VF8..."
                        className="rounded-2xl h-14 text-base font-medium"
                        style={{
                          background: "white",
                          border: "2px solid #0ea5e9",
                          boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehicleYear"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Năm sản xuất
                        </span>
                      }
                      rules={[
                        { required: true, message: "Nhập năm sản xuất!" },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #0ea5e9",
                          boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        placeholder="2024"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehicleColor"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Màu sắc
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập màu xe!" }]}
                    >
                      <Input
                        size="large"
                        placeholder="Trắng, Đen, Đỏ..."
                        className="rounded-2xl h-14 text-base font-medium"
                        style={{
                          background: "white",
                          border: "2px solid #0ea5e9",
                          boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehicleBodyType"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Dòng xe
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập dòng xe!" }]}
                    >
                      <Input
                        size="large"
                        placeholder="Sedan, SUV, Coupe..."
                        className="rounded-2xl h-14 text-base font-medium"
                        style={{
                          background: "white",
                          border: "2px solid #0ea5e9",
                          boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Thông số kỹ thuật */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
                  border: "3px solid #3b82f6",
                }}
              >
                <Space align="center" className="mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <ThunderboltOutlined className="text-3xl text-white" />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 text-blue-900"
                    style={{ fontSize: "1.75rem", fontWeight: 700 }}
                  >
                    Thông số kỹ thuật & Giá
                  </Title>
                </Space>

                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehicleRangeKm"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Quãng đường (km)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập quãng đường!" }]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        placeholder="500"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehicleMotorPowerKw"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Công suất (kW)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập công suất!" }]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        placeholder="150"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="vehiclePrice"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Giá bán (VNĐ)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập giá bán!" }]}
                    >
                      <InputNumber
                        size="large"
                        min={0}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        placeholder="1,000,000,000"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Mô tả & Hình ảnh */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  border: "3px solid #0284c7",
                }}
              >
                <Space align="center" className="mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <PictureOutlined className="text-3xl text-white" />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 text-blue-900"
                    style={{ fontSize: "1.75rem", fontWeight: 700 }}
                  >
                    Mô tả & Hình ảnh
                  </Title>
                </Space>

                <Form.Item
                  name="vehicleDescription"
                  label={
                    <span className="font-bold text-blue-900 text-base">
                      Mô tả chi tiết
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả chi tiết!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Mô tả tình trạng xe, lý do bán, các nâng cấp, bảo hành còn lại..."
                    className="rounded-2xl text-base font-medium"
                    style={{
                      resize: "none",
                      background: "white",
                      border: "2px solid #0284c7",
                      boxShadow: "0 4px 12px rgba(2,132,199,0.1)",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold text-blue-900 text-base">
                      Hình ảnh xe
                    </span>
                  }
                  className="mb-0"
                >
                  <Upload
                    {...uploadProps}
                    listType="picture-card"
                    className="upload-list-inline"
                  >
                    <div className="text-center p-3">
                      <UploadOutlined className="text-4xl mb-2 text-blue-600" />
                      <div className="font-bold text-blue-900">Tải ảnh lên</div>
                    </div>
                  </Upload>
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <Text className="text-blue-800 font-semibold">
                      💡 Mẹo: Tải lên từ 5-10 ảnh chất lượng cao để tăng khả
                      năng bán xe
                    </Text>
                  </div>
                </Form.Item>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 px-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={loading ? null : <CheckCircleOutlined />}
                  className="h-16 px-16 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    border: "none",
                  }}
                >
                  {loading ? "Đang đăng bài..." : "Đăng bài ngay"}
                </Button>

                <Button
                  size="large"
                  onClick={() => navigate("/posts")}
                  className="h-16 px-16 rounded-2xl font-bold text-lg transition-all transform hover:scale-105"
                  style={{
                    borderWidth: "3px",
                    borderColor: "#0ea5e9",
                    color: "#0ea5e9",
                    background: "white",
                    boxShadow: "0 4px 16px rgba(14,165,233,0.2)",
                  }}
                >
                  Xem tất cả bài đăng
                </Button>
              </div>
            </Form>
          </Card>

          {/* Bottom info */}
          <div className="text-center mt-12">
            <Text className="text-white text-base opacity-90">
              🔒 Thông tin của bạn được bảo mật tuyệt đối
            </Text>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PostVehicleSale;
