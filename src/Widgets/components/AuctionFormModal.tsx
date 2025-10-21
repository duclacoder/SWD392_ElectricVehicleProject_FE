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
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { CreateAuctionFormData } from "../../entities/AdminAuction";
import type { AdminVehicle } from "../../entities/AdminVehicle";
import type { AuctionCustom } from "../../entities/Auction";
import type { AuctionsFee } from "../../entities/AuctionsFee";
import { getAllAuctionsFees } from "../../features/Admin/api/adminAuctionsFeeApi";
import { getAllAdminVehicles } from "../../features/Admin/api/adminVehicleApi";

const { Option } = Select;

interface AuctionFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateAuctionFormData) => void;
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
  const [fees, setFees] = useState<AuctionsFee[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  useEffect(() => {
    if (visible) {
      form.resetFields();

      const fetchDropdownData = async () => {
        setDropdownLoading(true);
        try {
          const [vehiclesResult, feesResult] = await Promise.all([
            getAllAdminVehicles(1, 100),
            getAllAuctionsFees(1, 1000),
          ]);

          if (vehiclesResult) {
            setVehicles(vehiclesResult.items);
          }
          if (feesResult) {
            setFees(feesResult.items);
          }
        } catch (error) {
          message.error("Failed to load data for selection");
        } finally {
          setDropdownLoading(false);
        }
      };

      fetchDropdownData();
    }
  }, [visible, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const currentUserId = localStorage.getItem("userId");
        const finalValues: CreateAuctionFormData = {
          ...values,
          userName: currentUserId,
          endTime: values.endTime.toISOString(),
        };
        onSubmit(finalValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={"Add New Auction"}
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
          Submit
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

          <Form.Item
            name="auctionsFeeId"
            label="Auction Fee Package"
            rules={[{ required: true, message: "Please select a fee package" }]}
          >
            <Select
              showSearch
              placeholder="Select a fee package"
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {fees.map((fee) => (
                <Option
                  key={fee.auctionsFeeId}
                  value={fee.auctionsFeeId}
                  label={`${fee.type} - ${fee.description}`}
                >
                  <strong>{fee.type}</strong> (Entry:{" "}
                  {fee.entryFee.toLocaleString()} {fee.currency})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startPrice"
                label="Start Price"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="entryFee"
                label="Entry Fee (Override)"
                rules={[{ required: true }]}
                initialValue={0}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="openFee"
                label="Open Fee (Override)"
                rules={[{ required: true }]}
                initialValue={0}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="feePerMinute"
                label="Fee Per Minute (Override)"
                rules={[{ required: true }]}
                initialValue={0}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
