import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar.tsx";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AddCarFormValues {
  userId: number;
  vehicleName: string;
  description: string;
  brand: string;
  model: string;
  color: string;
  seats: number;
  bodyType: string;
  batteryCapacity: number; // decimal? maps to number
  rangeKm: number;
  chargingTimeHours: number; // decimal? maps to number
  fastChargingSupport: boolean; // bool? maps to boolean
  motorPowerKw: number; // decimal? maps to number
  topSpeedKph: number;
  acceleration: number; // decimal? maps to number
  connectorType: string;
  year: number;
  km: number;
  batteryStatus: string;
  warrantyMonths: number;
  price: number; // decimal? maps to number
  currency: string;
  image?: File;
}

const AddCar = () => {
  const [form] = Form.useForm();
  const currentUserId = localStorage.getItem("userId"); // Example: getting from localStorage
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("image", file); // ✅ store file in form
      setPreviewImage(URL.createObjectURL(file)); // ✅ generate preview
    }
  };
  if (!currentUserId) {
    message.error("User ID not found. Please log in.");
    return;
  }

  const handleAddCar = async (values: AddCarFormValues & { image?: File }) => {
    const formData = new FormData();

    // Append all fields from the form
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append logged-in user ID (if not directly in form)
    formData.append("UserId", currentUserId!);

    // Ensure image is included
    if (values.image) {
      formData.append("Image", values.image);
    }

    try {
      const response = await fetch("https://localhost:7000/AddCar", {
        method: "POST",
        body: formData, // ✅ No JSON, no headers needed!
      });

      const result = await response.json();

      if (result.isSuccess) {
        message.success(result.message || "Car added successfully!");
        form.resetFields();
      } else {
        message.error(result.message || "Failed to add car.");
      }
    } catch (error) {
      console.error("Error adding car:", error);
      message.error("Error adding car: Could not connect to the server.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <Title level={2} className="mb-5 text-gray-800 flex items-center">
              <PlusOutlined className="mr-2" /> Add New Car
            </Title>
            <Paragraph type="secondary" className="mb-5">
              Fill in the details below to add a new vehicle to your inventory.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddCar}
              initialValues={{
                userId: currentUserId, // Not a form field, but good for type consistency if needed
                vehicleName: "",
                description: "",
                brand: "",
                model: "",
                color: "",
                seats: 5, // Default within [1, 20]
                bodyType: undefined, // Let Ant Design handle placeholder
                batteryCapacity: 1, // Default within [1, 500]
                rangeKm: 1, // Default within [1, 2000]
                chargingTimeHours: 0.1, // Default within [0.1, 48]
                fastChargingSupport: false,
                motorPowerKw: 1, // Default within [1, 2000]
                topSpeedKph: 1, // Default within [1, 500]
                acceleration: 0.1, // Default within [0.1, 20]
                connectorType: undefined, // Let Ant Design handle placeholder
                year: new Date().getFullYear(), // Default within [1886, 10000]
                km: 0, // Default within [0, 1000000]
                batteryStatus: "",
                warrantyMonths: 0, // Default within [0, 240]
                price: 1, // Default within [1, 100000000]
                currency: "VND",
              }}
            >
              <Card title="Vehicle Information" className="mb-5">
                <Form.Item
                  name="vehicleName"
                  label="Vehicle Name"
                  rules={[
                    { required: true, message: "Please enter vehicle name" },
                    {
                      min: 2,
                      message: "Vehicle name must be at least 2 characters",
                    },
                    {
                      max: 100,
                      message: "Vehicle name cannot exceed 100 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g., Tesla Model 3 Long Range"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter a description" },
                    {
                      max: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Detailed description of the car..."
                    maxLength={500}
                  />
                </Form.Item>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[
                    { required: true, message: "Please enter the brand" },
                    {
                      max: 50,
                      message: "Brand name cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Tesla" maxLength={50} />
                </Form.Item>
                <Form.Item
                  name="model"
                  label="Model"
                  rules={[
                    { required: true, message: "Please enter the model" },
                    {
                      max: 50,
                      message: "Model name cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Model 3" maxLength={50} />
                </Form.Item>
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[
                    { required: true, message: "Please enter the color" },
                    {
                      max: 30,
                      message: "Color name cannot exceed 30 characters",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Red" maxLength={30} />
                </Form.Item>
                <Form.Item
                  name="year"
                  label="Year"
                  rules={[
                    {
                      required: true,
                      message: "Please enter manufacturing year",
                    },
                    {
                      type: "number",
                      min: 1886,
                      message: "Year must be 1886 or later",
                    },
                    {
                      type: "number",
                      max: 10000,
                      message: "Year cannot exceed 10000",
                    },
                  ]}
                >
                  <InputNumber
                    min={1886}
                    max={10000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="km"
                  label="Kilometers Driven"
                  rules={[
                    { required: true, message: "Please enter kilometers" },
                    {
                      type: "number",
                      min: 0,
                      message: "Kilometers cannot be negative",
                    },
                    {
                      type: "number",
                      max: 1000000,
                      message: "Kilometers cannot exceed 1,000,000",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={1000000}
                    style={{ width: "100%" }}
                    addonAfter="km"
                  />
                </Form.Item>
                <Form.Item
                  name="seats"
                  label="Number of Seats"
                  rules={[
                    { required: true, message: "Please enter number of seats" },
                    {
                      type: "number",
                      min: 1,
                      message: "Seats must be at least 1",
                    },
                    {
                      type: "number",
                      max: 20,
                      message: "Seats cannot exceed 20",
                    },
                  ]}
                >
                  <InputNumber min={1} max={20} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="bodyType"
                  label="Body Type"
                  rules={[
                    { required: true, message: "Please select body type" },
                    {
                      max: 30,
                      message: "Body type cannot exceed 30 characters",
                    }, // Although select, rule for consistency
                  ]}
                >
                  <Select placeholder="Select body type">
                    <Option value="Sedan">Sedan</Option>
                    <Option value="SUV">SUV</Option>
                    <Option value="Hatchback">Hatchback</Option>
                    <Option value="Coupe">Coupe</Option>
                    <Option value="Convertible">Convertible</Option>
                    <Option value="Van">Van</Option>
                    <Option value="Truck">Truck</Option>
                    {/* Add more options as needed */}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="image"
                  label="Upload Vehicle Image"
                  valuePropName="file"
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
                        alt="Vehicle Preview"
                        style={{
                          marginTop: "15px",
                          width: "200px",
                          borderRadius: "10px",
                        }}
                      />
                    )}
                  </>
                </Form.Item>
              </Card>

              <Card title="Electric Vehicle Specifications" className="mb-5">
                <Form.Item
                  name="batteryCapacity"
                  label="Battery Capacity"
                  rules={[
                    {
                      required: true,
                      message: "Please enter battery capacity",
                    },
                    {
                      type: "number",
                      min: 1,
                      message: "Battery capacity must be at least 1 kWh",
                    },
                    {
                      type: "number",
                      max: 500,
                      message: "Battery capacity cannot exceed 500 kWh",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={500}
                    step={0.1}
                    style={{ width: "100%" }}
                    addonAfter="kWh"
                  />
                </Form.Item>
                <Form.Item
                  name="rangeKm"
                  label="Range"
                  rules={[
                    { required: true, message: "Please enter range" },
                    {
                      type: "number",
                      min: 1,
                      message: "Range must be at least 1 km",
                    },
                    {
                      type: "number",
                      max: 2000,
                      message: "Range cannot exceed 2000 km",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={2000}
                    style={{ width: "100%" }}
                    addonAfter="km"
                  />
                </Form.Item>
                <Form.Item
                  name="chargingTimeHours"
                  label="Charging Time (Level 2)"
                  rules={[
                    { required: true, message: "Please enter charging time" },
                    {
                      type: "number",
                      min: 0.1,
                      message: "Charging time must be at least 0.1 hours",
                    },
                    {
                      type: "number",
                      max: 48,
                      message: "Charging time cannot exceed 48 hours",
                    },
                  ]}
                >
                  <InputNumber
                    min={0.1}
                    max={48}
                    step={0.1}
                    style={{ width: "100%" }}
                    addonAfter="hours"
                  />
                </Form.Item>
                <Form.Item
                  name="fastChargingSupport"
                  label="Fast Charging Support"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "Please indicate fast charging support",
                    },
                  ]}
                  // The required rule here ensures it's either true or false, not undefined.
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name="motorPowerKw"
                  label="Motor Power"
                  rules={[
                    { required: true, message: "Please enter motor power" },
                    {
                      type: "number",
                      min: 1,
                      message: "Motor power must be at least 1 kW",
                    },
                    {
                      type: "number",
                      max: 2000,
                      message: "Motor power cannot exceed 2000 kW",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={2000}
                    step={0.1}
                    style={{ width: "100%" }}
                    addonAfter="kW"
                  />
                </Form.Item>
                <Form.Item
                  name="topSpeedKph"
                  label="Top Speed"
                  rules={[
                    { required: true, message: "Please enter top speed" },
                    {
                      type: "number",
                      min: 1,
                      message: "Top speed must be at least 1 kph",
                    },
                    {
                      type: "number",
                      max: 500,
                      message: "Top speed cannot exceed 500 kph",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={500}
                    style={{ width: "100%" }}
                    addonAfter="kph"
                  />
                </Form.Item>
                <Form.Item
                  name="acceleration"
                  label="Acceleration (0-100 kph)"
                  rules={[
                    {
                      required: true,
                      message: "Please enter acceleration time",
                    },
                    {
                      type: "number",
                      min: 0.1,
                      message: "Acceleration must be at least 0.1 seconds",
                    },
                    {
                      type: "number",
                      max: 20,
                      message: "Acceleration cannot exceed 20 seconds",
                    },
                  ]}
                >
                  <InputNumber
                    min={0.1}
                    max={20}
                    step={0.1}
                    style={{ width: "100%" }}
                    addonAfter="sec"
                  />
                </Form.Item>
                <Form.Item
                  name="connectorType"
                  label="Connector Type"
                  rules={[
                    { required: true, message: "Please select connector type" },
                    {
                      max: 50,
                      message: "Connector type cannot exceed 50 characters",
                    }, // Rule for consistency
                  ]}
                >
                  <Select placeholder="Select connector type">
                    <Option value="Type 1 (J1772)">Type 1 (J1772)</Option>
                    <Option value="Type 2 (Mennekes)">Type 2 (Mennekes)</Option>
                    <Option value="CCS (Combo 1)">CCS (Combo 1)</Option>
                    <Option value="CCS (Combo 2)">CCS (Combo 2)</Option>
                    <Option value="CHAdeMO">CHAdeMO</Option>
                    <Option value="Tesla Supercharger">
                      Tesla Supercharger
                    </Option>
                    {/* Add more options as needed */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="batteryStatus"
                  label="Battery Status"
                  rules={[
                    { required: true, message: "Please enter battery status" },
                    {
                      max: 50,
                      message: "Battery status cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g., Healthy, Good, Excellent"
                    maxLength={50}
                  />
                </Form.Item>
              </Card>

              <Card title="Pricing and Warranty" className="mb-5">
                <Form.Item
                  name="warrantyMonths"
                  label="Warranty"
                  rules={[
                    {
                      required: true,
                      message: "Please enter warranty duration",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Warranty months cannot be negative",
                    },
                    {
                      type: "number",
                      max: 240,
                      message: "Warranty cannot exceed 240 months (20 years)",
                    },
                  ]}
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
                  rules={[
                    { required: true, message: "Please enter the price" },
                    {
                      type: "number",
                      min: 1,
                      message: "Price must be at least 1",
                    },
                    {
                      type: "number",
                      max: 100000000,
                      message: "Price cannot exceed 100,000,000",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100000000}
                    step={0.01} // Allow for decimal prices
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) =>
                      value ? parseFloat(value.replace(/\$\s?|(,*)/g, "")) : 0
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[
                    { required: true, message: "Please select currency" },
                    {
                      pattern: /^[A-Z]{3}$/,
                      message:
                        "Currency must be a 3-letter ISO code (e.g., USD, EUR).",
                    },
                  ]}
                >
                  <Select placeholder="Select currency">
                    <Option value="VND">VND - Vietnamese Dong</Option>
                    <Option value="USD">USD - United States Dollar</Option>
                    <Option value="EUR">EUR - Euro</Option>
                    {/* Add more options as needed */}
                  </Select>
                </Form.Item>
              </Card>

              <Form.Item className="text-center mt-6">
                <Button type="primary" htmlType="submit" size="large">
                  <Space>
                    <CarOutlined />
                    Add Car
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

export default AddCar;
