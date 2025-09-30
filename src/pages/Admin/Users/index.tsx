import {
  MoreOutlined,
  PlusOutlined,
  SafetyOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserFormData } from "../../../entities/Form";
import type { User as UserType } from "../../../entities/User";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../../../features/Admin/api";
import { UserFormModal } from "../../../Widgets/components/UserFormModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminUserPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllUsers(pagination.current, pagination.pageSize);
      if (result) {
        setUsers(result.items);
        setPagination((prev) => ({ ...prev, total: result.totalCount }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleShowAddModal = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = (user: UserType) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleModalSubmit = async (values: UserFormData) => {
    setSubmitLoading(true);
    let success = false;
    if (editingUser) {
      success = await updateUser(editingUser.usersId, values);
    } else {
      success = await createUser(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingUser(null);
      fetchUsers();
    }
    setSubmitLoading(false);
  };

  const handleDelete = (user: UserType) => {
    confirm({
      title: `Are you sure you want to delete ${user.fullName}?`,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const success = await deleteUser(user.usersId);
        if (success) {
          fetchUsers();
        }
      },
    });
  };

  const columns: TableProps<UserType>["columns"] = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (text, record) => (
        <Space>
          <Avatar src={record.imageUrl} icon={<UserOutlined />} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text, record) => (
        <Space>
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "roleName",
      sorter: (a, b) => (a.roleName || "").localeCompare(b.roleName || ""),
      render: (roleName) => {
        const roleText = roleName || "User";
        const color =
          roleText === "Admin"
            ? "volcano"
            : roleText === "Staff"
            ? "blue"
            : "geekblue";
        return (
          <Tag icon={<SafetyOutlined />} color={color}>
            {roleText}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleShowEditModal(record)}>
                Edit
              </Menu.Item>
              <Menu.Item
                key="delete"
                danger
                onClick={() => handleDelete(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredUsers = useMemo(() => {
    if (!searchText) return users;
    const lowercasedFilter = searchText.toLowerCase();
    return users.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [users, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTableChange: TableProps<UserType>["onChange"] = (
    newPagination
  ) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 8,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">
            Users Management
          </Title>
          <Text type="secondary">{pagination.total} Users</Text>
        </div>
        <Space>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleShowAddModal}
          >
            Add user
          </Button>
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredUsers}
        rowKey="usersId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <UserFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingUser}
        loading={submitLoading}
      />
    </div>
  );
};

export default AdminUserPage;
