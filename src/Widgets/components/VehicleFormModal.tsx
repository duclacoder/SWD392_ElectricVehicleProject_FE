import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import type { FC } from "react";
import { useEffect } from "react";
import type {
  AdminVehicle,
  AdminVehicleFormData,
} from "../../entities/AdminVehicle";

const { Option } = Select;
const { TextArea } = Input;

interface VehicleFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminVehicleFormData) => void;
  initialValues: Partial<AdminVehicle> | null;
  loading: boolean;
}

export const VehicleFormModal: FC<VehicleFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (visible) {
      if (isEditing && initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form, isEditing]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values as AdminVehicleFormData);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={isEditing ? "Edit Vehicle" : "Add New Vehicle"}
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      width={1000}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="vehicle_form"
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 16px" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="vehicleName"
              label="Vehicle Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="model" label="Model" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="color" label="Color" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="seats" label="Seats" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="bodyType"
              label="Body Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select body type">
                <Option value="Sedan">Sedan</Option>
                <Option value="SUV">SUV</Option>
                <Option value="Hatchback">Hatchback</Option>
                <Option value="Coupe">Coupe</Option>
                <Option value="Convertible">Convertible</Option>
                <Option value="Van">Van</Option>
                <Option value="Truck">Truck</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true }]}
              initialValue="VND"
            >
              <Select>
                <Option value="VND">VND</Option>
                <Option value="USD">USD</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="km"
              label="Kilometers (km)"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="batteryCapacity" label="Battery (kWh)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="rangeKm" label="Range (km)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="chargingTimeHours" label="Charging (hours)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="motorPowerKw" label="Motor Power (kW)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="topSpeedKph" label="Top Speed (kph)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="acceleration" label="Acceleration (0-100s)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="connectorType" label="Connector Type">
              <Select placeholder="Select connector type">
                <Option value="Type 1 (J1772)">Type 1 (J1772)</Option>
                <Option value="Type 2 (Mennekes)">Type 2 (Mennekes)</Option>
                <Option value="CCS (Combo 1)">CCS (Combo 1)</Option>
                <Option value="CCS (Combo 2)">CCS (Combo 2)</Option>
                <Option value="CHAdeMO">CHAdeMO</Option>
                <Option value="Tesla Supercharger">Tesla Supercharger</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="batteryStatus" label="Battery Status">
              <Input placeholder="e.g., Healthy, 95%" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="warrantyMonths" label="Warranty (months)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="fastChargingSupport"
          label="Fast Charging Support"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
