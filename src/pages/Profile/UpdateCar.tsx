import {
  Typography,
  Form,
  Input,
  InputNumber,
  //   Select,
  Switch,
  Button,
  message,
  Card,
  Space,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar";
import { CarOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
// const { Option } = Select;
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
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  status: string;
}

const UpdateCar = () => {
  const { userId, vehicleId } = useParams<{
    userId: string;
    vehicleId: string;
  }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState<CarDetail | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `https://localhost:7000/UserGetCarDetailsForUpdate/${userId}/${vehicleId}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.isSuccess) {
          setCar(data.result);
          form.setFieldsValue(data.result); // pre-fill form
        } else {
          message.error(data.message || "Failed to fetch car details.");
        }
      } catch (error) {
        console.error("Error fetching car:", error);
        message.error("Error fetching car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [userId, vehicleId, form]);

  const handleUpdateCar = async (values: CarDetail) => {
    const payload = {
      ...values,
      userId: Number(userId),
      vehiclesId: Number(vehicleId),
    };

    try {
      const response = await fetch("https://localhost:7000/UserCarUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.isSuccess) {
        message.success(result.message || "Car updated successfully!");
      } else {
        message.error(result.message || "Failed to update car.");
      }
    } catch (error) {
      console.error("Error updating car:", error);
      message.error("Error updating car: Could not connect to server.");
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
              Update the details of your car below.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateCar}
              initialValues={car || {}}
            >
              {/* Vehicle Info */}
              <Card title="Vehicle Information" className="mb-5">
                <Form.Item name="vehicleName" label="Vehicle Name">
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="brand" label="Brand">
                  <Input />
                </Form.Item>
                <Form.Item name="model" label="Model">
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
                <Form.Item name="warrantyMonths" label="Warranty">
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
                  <Input value={car?.status} disabled />
                </Form.Item>
                <Form.Item label="Created At">
                  <Input value={car?.createdAt} disabled />
                </Form.Item>
                <Form.Item label="Updated At">
                  <Input value={car?.updatedAt} disabled />
                </Form.Item>
              </Card>

              <Form.Item className="text-center mt-6">
                <Button type="primary" htmlType="submit" size="large">
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
