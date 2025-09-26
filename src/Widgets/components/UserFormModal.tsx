import { Button, Form, Input, Modal, Select, Switch } from "antd";
import type { FC } from "react";
import { useEffect } from "react";
import type { User } from "../../../../SWD392_ElectricVehicleProject_FE/src/entities/User";
import type { UserFormData } from "../../../src/entities/Form";

const { Option } = Select;

interface UserFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormData) => void;
  initialValues: Partial<User> | null;
  loading: boolean;
}

export const UserFormModal: FC<UserFormModalProps> = ({
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
        form.setFieldsValue({
          ...initialValues,
          roleId: initialValues.roleId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form, isEditing]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const finalValues = {
          ...values,
          status:
            values.status === undefined ? initialValues?.status : values.status,
        };
        onSubmit(finalValues);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={isEditing ? "Edit User" : "Add New User"}
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
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
      <Form form={form} layout="vertical" name="user_form">
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please input the full name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="userName"
          label="Username"
          rules={[{ required: true, message: "Please input the username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Please input the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        {!isEditing && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select placeholder="Select a role">
            <Option value={1}>Member</Option>
            <Option value={2}>Staff</Option>
            <Option value={3}>Admin</Option>
          </Select>
        </Form.Item>
        {isEditing && (
          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            initialValue={initialValues?.status}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
