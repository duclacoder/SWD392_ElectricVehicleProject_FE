import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import type { PostPackage } from "../../../entities/PostPackage";

const { Option } = Select;

interface PostPackageModalFormProps {
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
    form: any;
    editingItem: PostPackage | null;
    loading?: boolean;
}

const PostPackageModalForm: React.FC<PostPackageModalFormProps> = ({
    open,
    onCancel,
    onOk,
    form,
    editingItem,
    loading = false,
}) => {
    return (
        <Modal
            open={open}
            title={editingItem ? "Cập nhật gói bài đăng" : "Thêm gói bài đăng"}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={loading}
            centered
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    name="packageName"
                    label="Tên gói"
                    rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    name="postPrice"
                    label="Giá bài đăng"
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                    <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="currency" label="Đơn vị">
                    <Select>
                        <Option value="VND">VND</Option>
                        <Option value="USD">USD</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="postDuration" label="Thời hạn (ngày)">
                    <InputNumber min={1} className="w-full" />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="InActive">InActive</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PostPackageModalForm;
