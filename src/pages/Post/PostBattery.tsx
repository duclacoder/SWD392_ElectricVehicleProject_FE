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
import {
  PictureOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import { useAuth } from "../../Widgets/hooks/useAuth";
import type { CreateUserPostDTO } from "../../entities/UserPost";
import { createUserPost } from "../../features/Post";
import { Battery, Zap } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CheckWithGemini } from "../../shared/api/GeminiApi";
const { Title, Text } = Typography;

const PostBatterySale: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [fileList, setFileList] = useState<any[]>([]);

  const userId = localStorage.getItem("userId");
  const userPackageId = 1; // Giá trị UserPackageId giả lập/mặc định

  const uploadProps = {
    name: "file",
    headers: { authorization: "authorization-text" },
    multiple: true,
    fileList: fileList,
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFileList((prev) => [
          ...prev,
          {
            uid: file.uid,
            status: "done",
            url: reader.result,
            originFileObj: file,
          },
        ]);
      };
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
      if (!userId || !isLoggedIn) {
        message.error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!"
        );
        navigate("/login");
        return;
      }

      const filesToUpload = fileList
        .map((file) => file.originFileObj)
        .filter((file) => file instanceof File);

      if (filesToUpload.length === 0) {
        message.warning("Vui lòng tải lên ít nhất 1 ảnh pin!");
        setLoading(false);
        return;
      }

      const postData: CreateUserPostDTO = {
        userId: parseInt(userId),
        title:
          values.title || `${values.batteryBrand} ${values.batteryName}`,
        userPackageId: userPackageId, // Sử dụng package ID giả lập
        vehicle: null,
        battery: {
          batteryName: values.batteryName,
          brand: values.batteryBrand,
          description: values.batteryDescription,
          capacity: values.batteryCapacity,
          voltage: values.batteryVoltage,
          warrantyMonths: values.batteryWarrantyMonths,
          price: values.batteryPrice,
          currency: "VND",
        },
      };

      const check = await CheckWithGemini(values.batteryDescription);
      if (check === "Invalid") {
        message.warning("Đăng cái nội dung cho đàng hoàng vào");
      } else {
        const result = await createUserPost(postData, filesToUpload);
        if (result) {
          form.resetFields();
          setFileList([]);
          message.success("Đăng bài bán pin thành công! Bài đăng đang chờ duyệt.");
          navigate("/");
        } else {
          window.open("/packages");
          message.warning("bạn cần mua gói đăng bài trước");
        }

      }

    } catch (error) {
      console.error("Failed to create battery post:", error);
      message.error("Đã xảy ra lỗi khi đăng bài bán pin.");
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
              <Battery className="w-16 h-16 text-blue-600" />
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
              Đăng Bài Bán Pin
            </Title>
            <Text className="text-white text-xl opacity-95 font-medium block mb-8">
              Đăng tải pin của bạn để tiếp cận hàng ngàn người mua tiềm năng
            </Text>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">⚡ Nhanh chóng</Text>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">💎 Chất lượng</Text>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-30">
                <Text className="text-white font-semibold">🛡️ Bảo mật</Text>
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
              {/* Thông tin cơ bản về Pin */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", // Tông xanh nhạt
                  border: "3px solid #0ea5e9",
                }}
              >
                <Space align="center" className="mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Battery className="w-8 h-8 text-white" />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 text-blue-900"
                    style={{ fontSize: "1.75rem", fontWeight: 700 }}
                  >
                    Thông tin cơ bản về Pin
                  </Title>
                </Space>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="batteryBrand"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Thương hiệu Pin
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập thương hiệu pin!" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Panasonic, GS, Bosch..."
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
                      name="batteryName"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Tên Pin / Model
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập tên pin / model!" },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Premium, MF 50D20L..."
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

                <Form.Item
                  name="title"
                  label={
                    <span className="font-bold text-blue-900 text-base">
                      Tiêu đề bài đăng (Tùy chọn)
                    </span>
                  }
                  tooltip="Tiêu đề hấp dẫn giúp thu hút người mua (VD: Pin Panasonic 60Ah mới 95% giá tốt)"
                >
                  <Input
                    size="large"
                    placeholder="Pin Panasonic 60Ah mới 95% giá tốt"
                    className="rounded-2xl h-14 text-base font-medium"
                    style={{
                      background: "white",
                      border: "2px solid #0ea5e9",
                      boxShadow: "0 4px 12px rgba(14,165,233,0.1)",
                    }}
                  />
                </Form.Item>

              </div>

              {/* Thông số kỹ thuật & Giá Pin */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", // Tông xanh nhạt hơn
                  border: "3px solid #3b82f6",
                }}
              >
                <Space align="center" className="mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <Title
                    level={3}
                    className="!mb-0 text-blue-900"
                    style={{ fontSize: "1.75rem", fontWeight: 700 }}
                  >
                    Thông số & Giá
                  </Title>
                </Space>

                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="batteryCapacity"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Dung lượng (Ah)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập dung lượng (Ah)!" }]}
                    >
                      <InputNumber
                        size="large"
                        min={1}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        placeholder="60"
                        formatter={(v) => `${v} Ah`}
                        parser={(v) => v?.replace(' Ah', '') as number}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="batteryVoltage"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Điện áp (V)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập điện áp (V)!" }]}
                    >
                      <InputNumber
                        size="large"
                        min={1}
                        step={0.1}
                        style={{
                          width: "100%",
                          background: "white",
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
                        }}
                        className="rounded-2xl h-14 font-medium"
                        placeholder="12"
                        formatter={(v) => `${v} V`}
                        parser={(v) => v?.replace(' V', '') as number}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="batteryWarrantyMonths"
                      label={
                        <span className="font-bold text-blue-900 text-base">
                          Bảo hành còn lại (Tháng)
                        </span>
                      }
                      rules={[{ required: true, message: "Nhập số tháng bảo hành!" }]}
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
                        placeholder="12"
                        formatter={(v) => `${v} tháng`}
                        parser={(v) => v?.replace(' tháng', '') as number}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="batteryPrice"
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
                    parser={(v) => v?.replace(/,*/g, '') as number}
                    placeholder="2,500,000"
                  />
                </Form.Item>
              </div>

              {/* Mô tả & Hình ảnh */}
              <div
                className="rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%)", // Tông xanh nhạt nhất
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
                  name="batteryDescription"
                  label={
                    <span className="font-bold text-blue-900 text-base">
                      Mô tả chi tiết
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả chi tiết!" },
                  ]}
                >
                  <ReactQuill
                    theme="snow"
                    placeholder="Mô tả tình trạng pin, lý do bán, xe tương thích, thời gian sử dụng, bảo hành..."
                    className="rounded-2xl text-base font-medium bg-white"
                    style={{
                      height: "300px",
                      border: "2px solid #0284c7",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(2,132,199,0.1)",
                      overflow: "hidden",
                    }}
                    modules={{
                      toolbar: [
                        [{ 'font': [] }, { 'size': [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                    formats={[
                      'font', 'size', 'bold', 'italic', 'underline', 'strike',
                      'color', 'background', 'align', 'list', 'bullet', 'link', 'image'
                    ]}
                    onChange={(value) => form.setFieldValue("batteryDescription", value)}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="font-bold text-blue-900 text-base">
                      Hình ảnh Pin
                    </span>
                  }
                  className="mb-0"
                >
                  <Upload {...uploadProps} className="upload-list-inline">
                    <div className="text-center p-3">
                      <UploadOutlined className="text-4xl mb-2 text-blue-600" />
                      <div className="font-bold text-blue-900">Tải ảnh lên</div>
                    </div>
                  </Upload>
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <Text className="text-blue-800 font-semibold">
                      💡 Mẹo: Tải lên hình ảnh rõ ràng của pin, các tem nhãn và cọc pin.
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
                  className="h-16 px-16 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all transform hover:-translate-y-1"
                  style={{ background: "#0ea5e9", borderColor: "#0ea5e9" }}
                >
                  Đăng bài
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PostBatterySale;