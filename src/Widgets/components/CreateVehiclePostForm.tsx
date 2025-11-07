import React, { useState, useEffect } from "react";
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
  Radio,
  Card,
  Spin,
  Empty,
  Select,
} from "antd";
import { UploadOutlined, CheckCircleOutlined, CarOutlined } from "@ant-design/icons";
import { createUserPost } from "../../features/Post/index";
import type { CreateUserPostDTO } from "../../entities/UserPost";
import { useNavigate } from "react-router-dom";
import type {
  CreateVehiclePostDTOWithId,
} from "../../entities/UserPost";
import { apiRoot } from "../../shared/api/axios";
import type { UserVehicle } from "../../entities/User";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}
const VehiclePostForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [inputMode, setInputMode] = useState<"select" | "manual">("manual");
  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();


  useEffect(() => {
    fetchUserVehicles();
  }, []);

  const fetchUserVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Vui lòng đăng nhập!");
        return;
      }
      const response = await apiRoot.get("/GetAllCars", {
        params: { UserId: parseInt(userId), Page: 1, PageSize: 100 },
      });
      if (response.data.isSuccess && response.data.result?.items) {
        const availableVehicles = response.data.result.items.filter(
          (v: UserVehicle) => v.status !== "Đã bán"
        );
        setUserVehicles(availableVehicles);
      }
    } catch (error) {
      console.error("Lỗi khi tải xe:", error);
      message.error("Không thể tải danh sách xe");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleVehicleSelect = (vehicleId: number) => {
    const selectedVehicle = userVehicles.find(
      (v) => v.vehiclesId === vehicleId
    );
    if (selectedVehicle) {
      setSelectedVehicleId(vehicleId);
      form.setFieldsValue({
        title:
          selectedVehicle.vehicleName ||
          `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year}`,
        vehicleBrand: selectedVehicle.brand,
        vehicleModel: selectedVehicle.model,
        vehicleYear: selectedVehicle.year,
        vehicleColor: selectedVehicle.color,
        vehiclePrice: selectedVehicle.price,
        vehicleBodyType: selectedVehicle.bodyType,
        vehicleRangeKm: selectedVehicle.rangeKm,
        vehicleMotorPowerKw: selectedVehicle.motorPowerKw,
      });
    }
  };

  const handleInputModeChange = (mode: "select" | "manual") => {
    setInputMode(mode);
    setSelectedVehicleId(null);
    form.resetFields();
    setFileList([]);
  };




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


      const postData: CreateVehiclePostDTOWithId = {
        userId: parseInt(userId),
        title: values.title || `${values.vehicleBrand} ${values.vehicleModel}`,
        userPackageId: 1,
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

      if (inputMode === "select" && selectedVehicleId) {
        postData.vehicleId = selectedVehicleId;
      }

      const imageFiles = fileList
        .map((file) => file.originFileObj)
        .filter((file) => file instanceof File);

      const result = await createUserPost(postData, imageFiles);
      if (result) {
        message.success("✅ Đăng bài thành công!");
        form.resetFields();
        setFileList([]);
        onSuccess?.();
      } else {
        message.warning({
          content: "⚠️ Bạn không có gói đăng bài nào hợp lệ hoặc đã sử dụng hết. Đang chuyển đến trang mua gói...",
          duration: 3,
        });
        setTimeout(() => {
          navigate("/packages");
        }, 1500);
      }
    }
    catch (e) {
      console.error(e);
      message.error("Lỗi khi đăng bài! Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      {/* Input Mode Selection */}
      <Card className="mb-6 border-2 border-blue-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <CarOutlined className="mr-2 text-blue-600" /> Chọn cách nhập thông tin
        </h4>
        <Radio.Group
          value={inputMode}
          onChange={(e) => handleInputModeChange(e.target.value)}
          className="w-full grid grid-cols-2 gap-3"
        >
          <Radio.Button
            value="select"
            className="!h-auto !py-4 !px-4 !rounded-xl border-2"
          >
            <div className="text-center">
              <div className="font-semibold text-base">Chọn từ xe đã có</div>
              <div className="text-xs text-gray-500 mt-1">
                Sử dụng xe đã lưu trong hệ thống
              </div>
            </div>
          </Radio.Button>
          <Radio.Button
            value="manual"
            className="!h-auto !py-4 !px-4 !rounded-xl border-2"
          >
            <div className="text-center">
              <div className="font-semibold text-base">Nhập thông tin mới</div>
              <div className="text-xs text-gray-500 mt-1">
                Tạo bài viết từ đầu
              </div>
            </div>
          </Radio.Button>
        </Radio.Group>
      </Card>

      {/* Vehicle Selector */}
      {inputMode === "select" && (
        <Card className="mb-4">
          <Divider />
          {loadingVehicles ? (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="text-gray-500 mt-3">Đang tải danh sách xe...</p>
            </div>
          ) : userVehicles.length === 0 ? (
            <Empty
              description={
                <div>
                  <p className="text-gray-600 mb-2">
                    Bạn chưa có xe nào có thể đăng bài.
                  </p>
                  <p className="text-sm text-gray-500">
                    Vui lòng thêm xe hoặc chọn "Nhập thông tin mới".
                  </p>
                </div>
              }
            />
          ) : (
            <Form.Item
              label="Chọn một chiếc xe để đăng bài"
              name="selectedVehicle"
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn xe..."
                value={selectedVehicleId || undefined}
                onChange={handleVehicleSelect}
              >
                {userVehicles.map((vehicle) => (
                  <Select.Option
                    key={vehicle.vehiclesId}
                    value={vehicle.vehiclesId}
                  >
                    {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Card>
      )}

      {/* Form */}
      {(inputMode === "manual" || selectedVehicleId) && (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Card className="mb-4 shadow-sm">
            <h4 className="text-lg font-bold mb-4 text-blue-600">
              Thông tin bài viết
            </h4>
            <Form.Item
              name="title"
              label="Tiêu đề bài viết"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input
                placeholder="VD: Tesla Model 3 2024 - Như mới, full option"
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="vehicleBrand"
                  label="Hãng xe"
                  rules={[{ required: true, message: "Nhập hãng xe" }]}
                >
                  <Input placeholder="Tesla, VinFast..." size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="vehicleModel"
                  label="Mẫu xe"
                  rules={[{ required: true, message: "Nhập mẫu xe" }]}
                >
                  <Input placeholder="Model 3, VF8..." size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="vehicleYear"
                  label="Năm sản xuất"
                  rules={[{ required: true, message: "Nhập năm sản xuất" }]}
                >
                  <InputNumber
                    min={2000}
                    max={new Date().getFullYear() + 1}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicleColor"
                  label="Màu sắc"
                  rules={[{ required: true, message: "Nhập màu xe" }]}
                >
                  <Input placeholder="Trắng, Đen..." size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicleBodyType"
                  label="Dòng xe"
                  rules={[{ required: true, message: "Nhập dòng xe" }]}
                >
                  <Input placeholder="Sedan, SUV..." size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card className="mb-4 shadow-sm">
            <h4 className="text-lg font-bold mb-4 text-blue-600">
              Thông số kỹ thuật & Giá
            </h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="vehicleRangeKm"
                  label="Quãng đường (km)"
                  rules={[{ required: true, message: "Nhập quãng đường" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="500"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicleMotorPowerKw"
                  label="Công suất (kW)"
                  rules={[{ required: true, message: "Nhập công suất" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="150"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehiclePrice"
                  label="Giá bán (VND)"
                  rules={[{ required: true, message: "Nhập giá bán" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="1,000,000,000"
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v!.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="vehicleDescription"
              label="Mô tả chi tiết"
              rules={[{ required: true, message: "Nhập mô tả" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả tình trạng xe, lịch sử bảo dưỡng..."
              />
            </Form.Item>
          </Card>

          <Card className="mb-6 shadow-sm">
            <Form.Item
              label="Hình ảnh xe (tối thiểu 1 ảnh)"
              required
              className="mb-0"
            >
              <Upload {...uploadProps}>
                <div className="text-center p-3">
                  <UploadOutlined className="text-3xl mb-1 text-blue-600" />
                  <div className="font-bold text-blue-900">Tải ảnh lên</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tối đa 5MB/ảnh
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </Card>

          <div className="flex justify-end gap-3 border-t pt-4 bg-white sticky bottom-0">
            <Button onClick={onCancel} size="large">
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<CheckCircleOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đăng bài
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};


export default VehiclePostForm;
