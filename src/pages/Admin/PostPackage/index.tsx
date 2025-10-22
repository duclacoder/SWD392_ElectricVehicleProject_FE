import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Button,
    Dropdown,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Form,
} from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    MoreOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { adminPostPackageApi } from "../../../features/Admin/api/adminPostPackageApi";
import type { PostPackage } from "../../../entities/PostPackage";
import PostPackageModalForm from "../../../Widgets/components/PostPackageModalForm";
import PostPackageDetailModal from "../../../Widgets/components/PostPackageDetailModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

const PostPackagePage: React.FC = () => {
    const [data, setData] = useState<PostPackage[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PostPackage | null>(null);
    const [selectedItem, setSelectedItem] = useState<PostPackage | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    /** 📦 Fetch data */
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminPostPackageApi.getAll({
                page: 1,
                pageSize: 10,
            });
            if (res) {
                setData(res.items || []);
                setPagination((prev) => ({ ...prev, total: res.totalItems || 0 }));
            }
        } catch {
            message.error("Không tải được danh sách gói bài đăng");
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /** ➕ Thêm */
    const handleAdd = () => {
        form.resetFields();
        setEditingItem(null);
        setIsModalOpen(true);
    };

    /** ✏️ Chỉnh sửa */
    const handleEdit = (item: PostPackage) => {
        form.setFieldsValue({
            ...item,
            postDuration: item.postDuration || 0, // default if null
        });
        setEditingItem(item);
        setIsModalOpen(true);
    };

    /** 💾 Lưu */
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Ensure postDuration is number
            if (values.postDuration === null || values.postDuration === undefined) {
                values.postDuration = 0;
            }

            if (editingItem) {
                await adminPostPackageApi.update(editingItem.postPackageId, values);
                message.success("Cập nhật thành công!");
            } else {
                await adminPostPackageApi.create(values);
                message.success("Tạo mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch {
            message.error("Có lỗi xảy ra!");
        }
    };

    /** 🗑 Xóa */
    const handleDelete = (item: PostPackage) => {
        confirm({
            title: `Bạn có chắc muốn xóa "${item.packageName}" không?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            async onOk() {
                await adminPostPackageApi.delete(item.postPackageId);
                message.success("Đã xóa gói bài đăng!");
                fetchData();
            },
        });
    };

    /** 🔍 Xem chi tiết */
    const handleViewDetails = (item: PostPackage) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    /** 🔎 Filter search */
    const filteredData = useMemo(() => {
        if (!searchText) return data;
        const lower = searchText.toLowerCase();
        return data.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(lower)
            )
        );
    }, [data, searchText]);

    const columns = [
        {
            title: "Tên gói",
            dataIndex: "packageName",
            key: "packageName",
        },
        {
            title: "Giá",
            dataIndex: "postPrice",
            key: "postPrice",
            render: (price: number, record: PostPackage) =>
                `${price.toLocaleString()} ${record.currency}`,
        },
        {
            title: "Thời hạn (ngày)",
            dataIndex: "postDuration",
            key: "postDuration",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            align: "center" as const,
            render: (_: any, record: PostPackage) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: "1", label: "Xem chi tiết", icon: <EyeOutlined /> },
                            { key: "2", label: "Chỉnh sửa", icon: <EditOutlined /> },
                            { key: "3", label: "Xóa", icon: <DeleteOutlined />, danger: true },
                        ],
                        onClick: ({ key }) => {
                            if (key === "1") handleViewDetails(record);
                            else if (key === "2") handleEdit(record);
                            else if (key === "3") handleDelete(record);
                        },
                    }}
                >
                    <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={3} className="!mb-1">
                        Quản lý gói bài đăng
                    </Title>
                </div>
                <Space>
                    <Input
                        placeholder="Tìm kiếm gói..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm gói
                    </Button>
                </Space>
            </div>

            <Table
                rowKey="postPackageId"
                loading={loading}
                dataSource={filteredData}
                columns={columns}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) =>
                        setPagination({ ...pagination, current: page, pageSize }),
                }}
            />

            <PostPackageModalForm
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                form={form}
                editingItem={editingItem}
            />

            <PostPackageDetailModal
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                selectedItem={selectedItem}
            />
        </div>
    );
};

export default PostPackagePage;
