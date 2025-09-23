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
  message,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import type { User as UserType } from "../../../entities/User";
import { getAllUsers } from "../../../features/Admin/api";

const { Title, Text } = Typography;

// Placeholder functions for actions
const handleEdit = (user: UserType) => {
  message.info(`Editing user: ${user.fullName}`);
};

const handleDelete = (user: UserType) => {
  message.warning(`Deleting user: ${user.fullName}`);
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
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
    sorter: (a, b) => (a.role?.name || "").localeCompare(b.role?.name || ""),
    render: (role) => {
      const roleText = role?.name || "User";
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
            <Menu.Item key="edit" onClick={() => handleEdit(record)}>
              Edit
            </Menu.Item>
            <Menu.Item key="delete" danger onClick={() => handleDelete(record)}>
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

const AdminUserPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getAllUsers();
        if (result) {
          setUsers(result);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">
            Users Management
          </Title>
          <Text type="secondary">{users.length} Users</Text>
        </div>
        <Space>
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined className="text-gray-400" />}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Add user
          </Button>
        </Space>
      </div>

      {/* Table Section */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
        rowKey="usersId"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default AdminUserPage;
