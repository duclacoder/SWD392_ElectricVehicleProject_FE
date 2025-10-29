import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Switch,
  Tooltip,
  Upload,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type {
  AdminVehicle,
  AdminVehicleFormData,
} from "../../entities/AdminVehicle";

const { Option } = Select;
const { TextArea } = Input;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

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

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (visible) {
      if (isEditing && initialValues) {
        form.setFieldsValue({
          vehicleName: initialValues.vehicleName,
          brand: initialValues.brand,
          model: initialValues.model,
          color: initialValues.color,
          description: initialValues.description,
          ...initialValues,
          fastChargingSupport: Boolean(initialValues.fastChargingSupport),
        });

        if (initialValues.imageUrl) {
          setFileList([
            {
              uid: "-1",
              name: "current_image.png",
              status: "done",
              url: initialValues.imageUrl,
            },
          ]);
          setPreviewImage(initialValues.imageUrl);
        } else {
          setFileList([]);
          setPreviewImage("");
        }
      } else {
        form.resetFields();
        setFileList([]);
        setPreviewImage("");
      }
    } else {
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
    }
  }, [visible, initialValues, form, isEditing]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(
      newFileList.length ? [newFileList[newFileList.length - 1]] : []
    );
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/WEBP file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    return false;
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handleModalCancelPreview = () => setPreviewOpen(false);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const imageFile =
          fileList.length > 0 ? fileList[0].originFileObj : undefined;

        const finalValues = {
          ...values,
          image: imageFile,
        };
        onSubmit(finalValues as AdminVehicleFormData);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        message.error("Please fill in all required fields correctly.");
      });
  };

  return (
    <>
      <Modal
        title={
          <span className="font-semibold text-lg">
            {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
          </span>
        }
        open={visible}
        onCancel={onCancel}
        confirmLoading={loading}
        width={1000}
        footer={[
          <Button key="back" onClick={onCancel} className="rounded-lg">
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
            className="rounded-lg"
          >
            Submit
          </Button>,
        ]}
        styles={{
          body: { backgroundColor: "#f9fafb" },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="vehicle_form"
          style={{ maxHeight: "75vh", overflowY: "auto", padding: "10px 24px" }}
        >
          <Divider orientation="left" plain>
            Basic Information
          </Divider>

          <Row gutter={24}>
            {" "}
            <Col span={12}>
              <Form.Item
                name="vehicleName"
                label="Vehicle Name"
                rules={[
                  { required: true, message: "Please enter the vehicle name" },
                ]}
                tooltip="The main display name for the vehicle (e.g., Tesla Model 3 Long Range 2023)"
              >
                <Input placeholder="e.g., Vinfast VF8 Eco" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: "Please enter the brand" }]}
                tooltip="Manufacturer of the vehicle"
              >
                <Input placeholder="e.g., Vinfast, Tesla, Kia" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: "Please enter the model" }]}
                tooltip="Specific model of the vehicle"
              >
                <Input placeholder="e.g., VF8, Model Y, EV6" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Color"
                rules={[{ required: true, message: "Please enter the color" }]}
              >
                <Input placeholder="e.g., White, Black, Red" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            tooltip="Provide details about the vehicle's condition, features, history, etc."
          >
            <TextArea
              rows={3}
              placeholder="e.g., Car is in excellent condition, low mileage, includes premium sound system..."
            />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g., 2023"
                  min={1980}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="seats"
                label="Seats"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g., 5"
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
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
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 1000000000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
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
            <Col xs={24} sm={8}>
              <Form.Item
                name="km"
                label="Kilometers (km)"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 15000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span>
                Vehicle Image&nbsp;
                <Tooltip title="Upload one main image for the vehicle (JPG, PNG, WEBP, max 2MB).">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              </span>
            }
            rules={[
              { required: !isEditing, message: "Please upload an image!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              maxCount={1}
              accept="image/png, image/jpeg, image/webp"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {isEditing &&
            !fileList.find((f) => f.originFileObj) &&
            initialValues?.imageUrl && (
              <Paragraph
                type="secondary"
                style={{ marginTop: "-10px", marginBottom: "15px" }}
              >
                Current image will be kept unless a new one is uploaded.
              </Paragraph>
            )}

          <Divider orientation="left" plain>
            EV Specifications (Optional)
          </Divider>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="batteryCapacity"
                label="Battery (kWh)"
                tooltip="Total energy capacity of the battery."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 77.4"
                  addonAfter="kWh"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="rangeKm"
                label="Range (km)"
                tooltip="Estimated distance on a full charge (WLTP or EPA)."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 450"
                  addonAfter="km"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="chargingTimeHours"
                label="Charging (hours)"
                tooltip="Approximate time for a standard AC charge (e.g., 0-100%)."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  placeholder="e.g., 8.5"
                  addonAfter="hours"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="motorPowerKw"
                label="Motor Power (kW)"
                tooltip="Peak power output of the electric motor(s)."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 150"
                  addonAfter="kW"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="topSpeedKph"
                label="Top Speed (kph)"
                tooltip="Maximum speed the vehicle can reach."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 185"
                  addonAfter="kph"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="acceleration"
                label="Acceleration (0-100s)"
                tooltip="Time taken to accelerate from 0 to 100 kph."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                  placeholder="e.g., 5.2"
                  addonAfter="sec"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="connectorType"
                label="Connector Type"
                tooltip="Type of charging port (e.g., Type 2, CCS, CHAdeMO)."
              >
                <Select placeholder="Select connector type" allowClear>
                  <Option value="Type 1 (J1772)">Type 1 (J1772)</Option>
                  <Option value="Type 2 (Mennekes)">Type 2 (Mennekes)</Option>
                  <Option value="CCS (Combo 1)">CCS (Combo 1)</Option>
                  <Option value="CCS (Combo 2)">CCS (Combo 2)</Option>
                  <Option value="CHAdeMO">CHAdeMO</Option>
                  <Option value="Tesla (NACS)">Tesla (NACS)</Option>
                  <Option value="GB/T">GB/T</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="batteryStatus"
                label="Battery Status"
                tooltip="General condition or State of Health (SoH) if known."
              >
                <Input placeholder="e.g., Excellent, Good, 95% SoH" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="warrantyMonths"
                label="Warranty (Months)"
                tooltip="Remaining manufacturer warranty duration, if any."
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="e.g., 12"
                  addonAfter="months"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="fastChargingSupport"
            label="Fast Charging Support"
            valuePropName="checked"
            tooltip="Does the vehicle support DC fast charging?"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleModalCancelPreview}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
