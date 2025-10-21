import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import type { FC } from "react";
import { useEffect } from "react";
import type {
  AuctionsFee,
  AuctionsFeeFormData,
} from "../../entities/AuctionsFee";

const { Option } = Select;
const { TextArea } = Input;

interface AuctionsFeeFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AuctionsFeeFormData) => void;
  initialValues: Partial<AuctionsFee> | null;
  loading: boolean;
}

export const AuctionsFeeFormModal: FC<AuctionsFeeFormModalProps> = ({
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
        // Reset về giá trị default khi tạo mới
        form.resetFields();
        form.setFieldsValue({ currency: "VND" });
      }
    }
  }, [visible, initialValues, form, isEditing]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values as AuctionsFeeFormData);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={isEditing ? "Edit Auctions Fee" : "Add New Auctions Fee"}
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
      <Form
        form={form}
        layout="vertical"
        name="auctions_fee_form"
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 16px" }}
      >
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea rows={3} placeholder="Mô tả về gói phí..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="entryFee"
              label="Entry Fee"
              rules={[{ required: true, message: "Please enter an entry fee" }]}
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
              name="feePerMinute"
              label="Fee Per Minute"
              rules={[
                { required: true, message: "Please enter a fee per minute" },
              ]}
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
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Please enter a type" }]}
            >
              <Input placeholder="e.g., Standard, Premium" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
