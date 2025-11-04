import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { AdminVehicle } from "../../entities/AdminVehicle";
import type { AuctionCustom } from "../../entities/Auction";
import type { CreateAuctionWithAutoFeeFormData } from "../../features/Admin/api/adminAuctionApi";
import { getAllAdminVehicles } from "../../features/Admin/api/adminVehicleApi";

const { Option } = Select;

interface AuctionFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateAuctionWithAutoFeeFormData) => void;
  initialValues: Partial<AuctionCustom> | null;
  loading: boolean;
}

export const AuctionFormModal: FC<AuctionFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const isEditing = !!initialValues;

  useEffect(() => {
    if (visible) {
      if (isEditing && initialValues) {
        // Set form values for editing
        form.setFieldsValue({
          vehicleId: initialValues.vehicleId,
          entryFee: initialValues.entryFee,
          endTime: initialValues.endTime ? dayjs(initialValues.endTime) : null,
        });
      } else {
        // Reset form for creating new auction
        form.resetFields();
      }

      const fetchDropdownData = async () => {
        setDropdownLoading(true);
        try {
          const vehiclesResult = await getAllAdminVehicles(1, 100);

          if (vehiclesResult) {
            setVehicles(vehiclesResult.items);
          }
        } catch (error) {
          message.error("Failed to load data for selection");
        } finally {
          setDropdownLoading(false);
        }
      };

      fetchDropdownData();
    }
  }, [visible, form, isEditing, initialValues]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const currentUserId = localStorage.getItem("userId");
        const finalValues: CreateAuctionWithAutoFeeFormData = {
          userName: currentUserId || "",
          vehicleId: values.vehicleId,
          endTime: values.endTime.toISOString(),
          entryFee: values.entryFee,
          startPrice: values.startPrice,
        };
        onSubmit(finalValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={isEditing ? "Edit Auction" : "Add New Auction"}
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      width={800}
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
          {isEditing ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Spin spinning={dropdownLoading} tip="Loading selection data...">
        <Form
          form={form}
          layout="vertical"
          name="auction_form"
          style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 16px" }}
        >
          <Form.Item
            name="vehicleId"
            label="Vehicle"
            rules={[{ required: true, message: "Please select a vehicle" }]}
          >
            <Select
              showSearch
              placeholder="Select a vehicle"
              optionFilterProp="children"
              disabled={isEditing} // Disable vehicle selection when editing
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {vehicles.map((vehicle) => (
                <Option
                  key={vehicle.vehiclesId}
                  value={vehicle.vehiclesId}
                  label={`${vehicle.vehicleName} (ID: ${vehicle.vehiclesId})`}
                >
                  <strong>{vehicle.vehicleName}</strong> (Brand: {vehicle.brand}
                  , Year: {vehicle.year})
                </Option>
              ))}
            </Select>
          </Form.Item>

          

          <Row gutter={16}>
             <Col span={12}>
              <Form.Item
                name="startPrice"
                label="Start Price (Giá khởi điểm)"
                rules={[{ required: true, message: "Please enter entry fee" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isEditing} // Disable entry fee when editing
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined) =>
                    value ? parseFloat(value.replace(/,/g, "")) : 0
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="entryFee"
                label="Entry Fee (Phí khởi điểm)"
                rules={[{ required: true, message: "Please enter entry fee" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled={isEditing} // Disable entry fee when editing
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined) =>
                    value ? parseFloat(value.replace(/,/g, "")) : 0
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true }]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Hidden fields with fixed values
          <Form.Item
            name="startPrice"
            initialValue={0}
            style={{ display: "none" }}
          >
            <InputNumber />
          </Form.Item> */}

          <div
            style={{
              padding: "16px",
              backgroundColor: isEditing ? "#fff7e6" : "#f0f8ff",
              borderRadius: "6px",
              marginTop: "16px",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: isEditing ? "#fa8c16" : "#1890ff",
              }}
            >
              {isEditing
                ? "Edit Mode - Limited Fields"
                : "Auto-Generated Fee Information"}
            </h4>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              {isEditing ? (
                <>
                  • <strong>Editable:</strong> End Time only
                  <br />• <strong>Status:</strong> Will be set to "Active"
                  <br />• <strong>Other fields:</strong> Cannot be modified
                  during edit
                </>
              ) : (
                <>
                  • <strong>Start Price:</strong> Fixed at 0<br />•{" "}
                  <strong>Fee Per Minute:</strong> Fixed at 0<br />•{" "}
                  <strong>Open Fee:</strong> Fixed at 0<br />•{" "}
                  <strong>Auction Fee Entry Fee:</strong> Will be 1% of Entry
                  Fee above
                  <br />• <strong>Auction Fee Description:</strong> "Phí tham
                  gia"
                  <br />• <strong>Auction Fee Type:</strong> "Phí tham gia"
                  <br />• <strong>Status:</strong> "Active"
                </>
              )}
            </p>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
