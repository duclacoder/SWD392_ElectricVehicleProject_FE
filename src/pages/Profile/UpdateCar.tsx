import { CarOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Spin,
  Switch,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface CarDetail {
  vehiclesId: number;
  userId: number;
  vehicleName: string;
  description: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  batteryCapacity: number;
  rangeKm: number;
  chargingTimeHours: number;
  fastChargingSupport: boolean;
  motorPowerKw: number;
  topSpeedKph: number;
  acceleration: number;
  connectorType: string;
  year: number;
  km: number;
  batteryStatus: string;
  warrantyMonths: number;
  price: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
  status?: string;
  imageUrl?: string;
}

const UpdateCar = () => {
  const { userId, vehicleId } = useParams<{
    userId: string;
    vehicleId: string;
  }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true); // loading while fetching
  const [submitting, setSubmitting] = useState(false); // loading while submitting
  const [car, setCar] = useState<CarDetail | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(
          `https://localhost:7000/UserGetCarDetailsForUpdate/${userId}/${vehicleId}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (data.isSuccess) {
          setCar(data.result);
          // Pre-fill form fields
          form.setFieldsValue({
            ...data.result,
            // Ensure switches and other boolean values are properly set:
            fastChargingSupport: Boolean(data.result.fastChargingSupport),
          });
          setPreviewImage(data.result.imageUrl ?? null); // show old image
        } else {
          message.error(data.message || "Failed to fetch car details.");
        }
      } catch (err) {
        console.error("Fetch car error:", err);
        message.error("Error fetching car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [userId, vehicleId, form]);

  // Image input change: set file and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      form.setFieldValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Build FormData and submit
  const handleUpdateCar = async (values: any) => {
    // Disable submit button
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Append every field from form values
      // Convert undefined/null -> skip
      Object.entries(values).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        // For boolean and number values, convert to string because FormData stores strings/blobs
        if (typeof val === "boolean" || typeof val === "number") {
          formData.append(key, String(val));
        } else {
          // Strings and others
          formData.append(key, val as any);
        }
      });

      // Ensure userId & vehiclesId are included (form values may or may not include them)
      if (!formData.has("userId")) formData.append("userId", userId ?? "");
      if (!formData.has("vehiclesId"))
        formData.append("vehiclesId", vehicleId ?? "");

      // If the user selected a new image file, append it as "Image"
      // If not selectedFile, do NOT append "Image" -> backend should keep old image
      if (selectedFile) {
        formData.append("Image", selectedFile, selectedFile.name);
      }

      const res = await fetch("https://localhost:7000/UserCarUpdate", {
        method: "PUT",
        // DO NOT set Content-Type header — browser sets multipart boundary automatically
        body: formData,
      });

      const result = await res.json();

      if (result.isSuccess) {
        message.success(result.message || "Car updated successfully!");
        // Wait 1.5s (1500ms) as requested for a visible success pause
        await new Promise((r) => setTimeout(r, 1500));
        // No redirect (per your last instruction). If you want to navigate, add it later.
      } else {
        message.error(result.message || "Failed to update car.");
      }
    } catch (err) {
      console.error("Update error:", err);
      message.error("Error updating car: Could not connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <Title level={2} className="mb-5 text-gray-800 flex items-center">
              <EditOutlined className="mr-2" /> Update Car
            </Title>
            <Paragraph type="secondary" className="mb-5">
              Update the details of your car below. If you don't select a new
              image, the existing image will remain.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateCar}
              initialValues={car || {}}
            >
              {/* Vehicle Info */}
              <Card title="Vehicle Information" className="mb-5">
                <Form.Item
                  name="vehicleName"
                  label="Vehicle Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="model"
                  label="Model"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="color" label="Color">
                  <Input />
                </Form.Item>
                <Form.Item name="year" label="Year">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="km" label="Kilometers Driven">
                  <InputNumber style={{ width: "100%" }} addonAfter="km" />
                </Form.Item>
                <Form.Item name="seats" label="Seats">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="bodyType" label="Body Type">
                  <Input />
                </Form.Item>

                {/* Image upload + preview */}
                <Form.Item
                  label="Vehicle Image (choose to replace)"
                  name="image"
                  valuePropName="file"
                >
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Vehicle Preview"
                        style={{ marginTop: 15, width: 200, borderRadius: 10 }}
                      />
                    )}
                  </>
                </Form.Item>
              </Card>

              {/* EV Specs */}
              <Card title="Electric Vehicle Specifications" className="mb-5">
                <Form.Item name="batteryCapacity" label="Battery Capacity">
                  <InputNumber style={{ width: "100%" }} addonAfter="kWh" />
                </Form.Item>
                <Form.Item name="rangeKm" label="Range">
                  <InputNumber style={{ width: "100%" }} addonAfter="km" />
                </Form.Item>
                <Form.Item name="chargingTimeHours" label="Charging Time">
                  <InputNumber style={{ width: "100%" }} addonAfter="hours" />
                </Form.Item>
                <Form.Item
                  name="fastChargingSupport"
                  label="Fast Charging Support"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item name="motorPowerKw" label="Motor Power">
                  <InputNumber style={{ width: "100%" }} addonAfter="kW" />
                </Form.Item>
                <Form.Item name="topSpeedKph" label="Top Speed">
                  <InputNumber style={{ width: "100%" }} addonAfter="kph" />
                </Form.Item>
                <Form.Item name="acceleration" label="Acceleration (0-100 kph)">
                  <InputNumber style={{ width: "100%" }} addonAfter="sec" />
                </Form.Item>
                <Form.Item name="connectorType" label="Connector Type">
                  <Input />
                </Form.Item>
                <Form.Item name="batteryStatus" label="Battery Status">
                  <Input />
                </Form.Item>
              </Card>

              {/* Pricing */}
              <Card title="Pricing and Warranty" className="mb-5">
                <Form.Item name="warrantyMonths" label="Warranty (months)">
                  <InputNumber style={{ width: "100%" }} addonAfter="months" />
                </Form.Item>
                <Form.Item name="price" label="Price">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="currency" label="Currency">
                  <Input />
                </Form.Item>
              </Card>

              {/* Read-only fields */}
              <Card title="Read-only Information" className="mb-5">
                <Form.Item label="Verified">
                  <Input value={car?.verified ? "Yes" : "No"} disabled />
                </Form.Item>
                <Form.Item label="Status">
                  <Input value={car?.status ?? ""} disabled />
                </Form.Item>
                <Form.Item label="Created At">
                  <Input value={car?.createdAt ?? ""} disabled />
                </Form.Item>
                <Form.Item label="Updated At">
                  <Input value={car?.updatedAt ?? ""} disabled />
                </Form.Item>
              </Card>

              <Form.Item className="text-center mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  disabled={submitting}
                >
                  <Space>
                    <CarOutlined />
                    Update Car
                  </Space>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateCar;
