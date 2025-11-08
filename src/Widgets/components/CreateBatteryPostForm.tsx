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
  Select,
  Radio,
  Card,
  Spin,
  Empty,
  type UploadFile
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { createUserPost } from "../../features/Post/index";
import type { CreateBatteryPostDTOWithId, CreateUserPostDTO } from "../../entities/UserPost";
import { useNavigate } from "react-router-dom";
import type { UserBattery } from "../../entities/User";
import { apiRoot } from "../../shared/api/axios";
import { CheckWithGemini } from "../../shared/api/GeminiApi";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BatteryPostForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [inputMode, setInputMode] = useState<"select" | "manual">("manual");
  const [userBatteries, setUserBatteries] = useState<UserBattery[]>([]);
  const [loadingBatteries, setLoadingBatteries] = useState(false);
  const [selectedBatteryId, setSelectedBatteryId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBatteries();
  }, []);

  const fetchUserBatteries = async () => {
    setLoadingBatteries(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Vui lòng đăng nhập!");
        return;
      }

      const response = await apiRoot.get("/GetAllBattery", {
        params: {
          UserId: parseInt(userId),
          Page: 1,
          PageSize: 100
        },
      });

      if (response.data.isSuccess && response.data.result?.items) {
        const availableBatteries = response.data.result.items.filter(
          (b: UserBattery) => b.status !== "Sold"
        );
        setUserBatteries(availableBatteries);
      }
    } catch (error) {
      console.error("Lỗi khi tải pin:", error);
      message.error("Không thể tải danh sách Pin/Ắc quy");
    } finally {
      setLoadingBatteries(false);
    }
  };

  const handleBatterySelect = (batteryId: number) => {
    const selectedBattery = userBatteries.find((b) => b.batteriesId === batteryId);
    if (selectedBattery) {
      setSelectedBatteryId(batteryId);
      form.setFieldsValue({
        title: selectedBattery.batteryName || `${selectedBattery.brand} Battery`,
        batteryName: selectedBattery.batteryName,
        batteryBrand: selectedBattery.brand,
        batteryCapacity: selectedBattery.capacity,
        batteryVoltage: selectedBattery.voltage,
        batteryWarrantyMonths: selectedBattery.warrantyMonths,
        batteryPrice: selectedBattery.price,
        batteryDescription: selectedBattery.description,
      });
    }
  };

  const handleInputModeChange = (mode: "select" | "manual") => {
    setInputMode(mode);
    setSelectedBatteryId(null);
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
      fileList,
      multiple: true,
      listType: "picture-card" as const,
      beforeUpload: (file: File) => {
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
        
        // Add file to list with proper structure
        setFileList((prev) => [
          ...prev,
          {
            uid: `${Date.now()}-${file.name}`,
            name: file.name,
            status: 'done',
            originFileObj: file,
          } as UploadFile,
        ]);
        
        return false; // Prevent auto upload
      },
      onRemove: (file: UploadFile) => {
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
        message.warning("Vui lòng tải lên ít nhất 1 ảnh Pin/Ắc quy!");
        setLoading(false);
        return;
      }

      const rawPrice =
        typeof values.batteryPrice === "string"
          ? parseInt(values.batteryPrice.replace(/,/g, ""), 10)
          : values.batteryPrice;

      const postData: CreateBatteryPostDTOWithId = {
        userId: parseInt(userId),
        title: values.title || `${values.batteryBrand} ${values.batteryName}`,
        userPackageId: 1,
        battery: {
          batteryName: values.batteryName,
          brand: values.batteryBrand,
          description: values.batteryDescription,
          capacity: values.batteryCapacity,
          voltage: values.batteryVoltage,
          warrantyMonths: values.batteryWarrantyMonths,
          price: rawPrice,
          currency: "VND",
        },
        description: values.batteryDescription || values.title,
      };

      if (inputMode === "select" && selectedBatteryId) {
        postData.batteryId = selectedBatteryId;
      }

 

      const check = await CheckWithGemini(values.batteryDescription);

      if (check === "Invalid") {
        message.warning("Nội dung không hợp lệ")
      } else {
             const imageFiles = fileList
        .map((file) => file.originFileObj)
        .filter((file) => file instanceof File);
        const result = await createUserPost(postData as CreateUserPostDTO, imageFiles);

        if (result) {
          message.success("✅ Đăng bài thành công!");
          form.resetFields();
          setFileList([]);
          onSuccess?.();
        } else {
          message.warning({
            content:
              "⚠️ Bạn không có gói đăng bài nào hợp lệ hoặc đã sử dụng hết. Đang chuyển đến trang mua gói...",
            duration: 3,
          });
          setTimeout(() => {
            window.open("/packages");
          }, 1500);
        }
      }
    } catch (e) {
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
          <ThunderboltOutlined className="mr-2 text-blue-600" /> Chọn cách nhập thông tin
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
              <div className="font-semibold text-base">Chọn từ Pin đã có</div>
              <div className="text-xs text-gray-500 mt-1">
                Sử dụng Pin đã lưu trong hệ thống
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

      {/* Battery Selector */}
      {inputMode === "select" && (
        <Card className="mb-4">
          <Divider />
          {loadingBatteries ? (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="text-gray-500 mt-3">Đang tải danh sách Pin/Ắc quy...</p>
            </div>
          ) : userBatteries.length === 0 ? (
            <Empty
              description={
                <div>
                  <p className="text-gray-600 mb-2">
                    Bạn chưa có Pin/Ắc quy nào có thể đăng bài.
                  </p>
                  <p className="text-sm text-gray-500">
                    Vui lòng thêm Pin hoặc chọn "Nhập thông tin mới".
                  </p>
                </div>
              }
            />
          ) : (
            <Form.Item
              label="Chọn một Pin/Ắc quy để đăng bài"
              name="selectedBattery"
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn Pin/Ắc quy..."
                value={selectedBatteryId || undefined}
                onChange={handleBatterySelect}
              >
                {userBatteries.map((battery) => (
                  <Select.Option
                    key={battery.batteriesId}
                    value={battery.batteriesId}
                  >
                    {`${battery.brand} ${battery.batteryName} (${battery.capacity}Ah)`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Card>
      )}

      {/* Form */}
      {(inputMode === "manual" || selectedBatteryId) && (
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
                placeholder="VD: Pin GS 12V 65Ah - Còn mới 95%"
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="batteryName"
                  label="Tên Pin/Ắc quy"
                  rules={[{ required: true, message: "Nhập tên Pin" }]}
                >
                  <Input placeholder="VD: NS70" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="batteryBrand"
                  label="Thương hiệu"
                  rules={[{ required: true, message: "Nhập thương hiệu" }]}
                >
                  <Input placeholder="GS, Rocket, Bosch..." size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="batteryCapacity"
                  label="Dung lượng (Ah)"
                  rules={[{ required: true, message: "Nhập dung lượng" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="65"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="batteryVoltage"
                  label="Điện áp (V)"
                  rules={[{ required: true, message: "Nhập điện áp" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="12"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="batteryWarrantyMonths"
                  label="Bảo hành (tháng)"
                  rules={[{ required: true, message: "Nhập bảo hành" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="12"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card className="mb-4 shadow-sm">
            <h4 className="text-lg font-bold mb-4 text-blue-600">
              Giá & Mô tả
            </h4>
            <Form.Item
              name="batteryPrice"
              label="Giá bán (VND)"
              rules={[{ required: true, message: "Nhập giá bán" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                size="large"
                placeholder="1,500,000"
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(v) => v!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="batteryDescription"
              label="Mô tả chi tiết"
              rules={[{ required: true, message: "Nhập mô tả" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả tình trạng, nguồn gốc, lý do bán..."
              />
            </Form.Item>
          </Card>

          <Card className="mb-6 shadow-sm">
            <Form.Item
              label="Hình ảnh Pin/Ắc quy (tối thiểu 1 ảnh)"
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

export default BatteryPostForm;