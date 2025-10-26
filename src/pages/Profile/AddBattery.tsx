import { ThunderboltOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Typography,
} from "antd";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";
import { useState } from "react";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddBatteryFormValues {
  userId: number;
  batteryName: string;
  description: string;
  brand: string;
  capacity: number;
  voltage: number;
  warrantyMonths: number;
  price: number;
  currency: string;
  image?: File;
}

const AddBattery = () => {
  const [form] = Form.useForm();
  const currentUserId = localStorage.getItem("userId");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!currentUserId) {
    message.error("User ID not found. Please log in.");
    return null;
  }

  // ✅ Image upload + preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Submit using FormData instead of JSON
  const handleAddBattery = async (values: AddBatteryFormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    formData.append("userId", currentUserId);

    if (values.image) {
      formData.append("ImageUpload", values.image); // 👈 MUST MATCH C# PARAMETER NAME
    }

    try {
      const response = await fetch("https://localhost:7000/AddBattery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.isSuccess) {
        message.success(result.message || "Battery added successfully!");
        form.resetFields();
        setPreviewImage(null);
      } else {
        message.error(result.message || "Failed to add battery.");
      }
    } catch (error) {
      console.error("Error adding battery:", error);
      message.error("Could not connect to server.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <Title level={2} className="mb-5">
              <PlusOutlined className="mr-2" /> Add New Battery
            </Title>
            <Paragraph type="secondary" className="mb-5">
              Fill in the details below to add a new battery.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddBattery}
              initialValues={{
                batteryName: "",
                description: "",
                brand: "",
                capacity: 1,
                voltage: 1,
                warrantyMonths: 0,
                price: 1,
                currency: "VND",
              }}
            >
              <Card title="Battery Information" className="mb-5">
                {/* ✅ All original fields stay unchanged */}
                <Form.Item
                  name="batteryName"
                  label="Battery Name"
                  rules={[
                    { required: true, message: "Please enter battery name" },
                  ]}
                >
                  <Input placeholder="e.g., Panasonic EV48" maxLength={100} />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <TextArea
                    rows={3}
                    maxLength={500}
                    placeholder="Battery details..."
                  />
                </Form.Item>

                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g., Panasonic" maxLength={50} />
                </Form.Item>

                <Form.Item
                  name="capacity"
                  label="Capacity (kWh)"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={1}
                    max={1000}
                    style={{ width: "100%" }}
                    addonAfter="kWh"
                  />
                </Form.Item>

                <Form.Item
                  name="voltage"
                  label="Voltage (V)"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={1}
                    max={999}
                    style={{ width: "100%" }}
                    addonAfter="V"
                  />
                </Form.Item>

                {/* ✅ Image Upload Like AddCar */}
                <Form.Item
                  name="image"
                  label="Upload Battery Image"
                  rules={[
                    { required: true, message: "Please upload an image!" },
                  ]}
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
                        alt="Battery Preview"
                        style={{ marginTop: 15, width: 200, borderRadius: 10 }}
                      />
                    )}
                  </>
                </Form.Item>
              </Card>

              <Card title="Pricing & Warranty" className="mb-5">
                <Form.Item
                  name="warrantyMonths"
                  label="Warranty (Months)"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    max={240}
                    style={{ width: "100%" }}
                    addonAfter="months"
                  />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={1}
                    max={100000000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="VND">VND</Option>
                    <Option value="USD">USD</Option>
                    <Option value="EUR">EUR</Option>
                  </Select>
                </Form.Item>
              </Card>

              <Form.Item className="text-center">
                <Button type="primary" htmlType="submit" size="large">
                  <Space>
                    <ThunderboltOutlined />
                    Add Battery
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

export default AddBattery;
