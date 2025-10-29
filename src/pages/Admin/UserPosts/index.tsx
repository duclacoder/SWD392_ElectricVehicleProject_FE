import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserPostCustom } from "../../../entities/UserPost";
import {
  deleteUserPost,
  getAllUserPosts,
  getUserPostById,
} from "../../../features/Admin/api/adminUserPostApi";
import { UserPostDetailModal } from "../../../Widgets/components/UserPostDetailModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminUserPostPage = () => {
  const [userPosts, setUserPosts] = useState<UserPostCustom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // State cho modal Chi tiết
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedUserPost, setSelectedUserPost] =
    useState<UserPostCustom | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUserPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllUserPosts(
        pagination.current,
        pagination.pageSize
      );
      if (result) {
        setUserPosts(result.items);
        setPagination((prev) => ({
          ...prev,
          total: result.totalCount,
        }));
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // --- Handlers cho modal Chi tiết ---
  const handleShowDetailModal = async (userPost: UserPostCustom) => {
    if (userPost.userPostId) {
      const fullUserPost = await getUserPostById(userPost.userPostId);
      if (fullUserPost) {
        setSelectedUserPost(fullUserPost);
        setIsDetailVisible(true);
      }
    }
  };

  const handleDetailModalCancel = () => {
    setIsDetailVisible(false);
    setSelectedUserPost(null);
  };

  // --- Handler cho xóa ---
  const handleDelete = (userPost: UserPostCustom) => {
    confirm({
      title: "Are you sure you want to delete this user post?",
      content: `Post: "${userPost.title}"`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (userPost.userPostId) {
          const success = await deleteUserPost(userPost.userPostId);
          if (success) {
            fetchUserPosts(); // Reload danh sách
          }
        }
      },
    });
  };

  // Cập nhật columns cho UserPosts
  const columns: TableProps<UserPostCustom>["columns"] = [
    {
      title: "Post ID",
      dataIndex: "userPostId",
      key: "userPostId",
      sorter: (a, b) => (a.userPostId || 0) - (b.userPostId || 0),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div style={{ maxWidth: 200 }}>
          {text && text.length > 50
            ? `${text.substring(0, 50)}...`
            : text || "N/A"}
        </div>
      ),
    },
    {
      title: "Vehicle Brand",
      key: "vehicleBrand",
      render: (_, record) => record.vehicle?.brand || "N/A",
    },
    {
      title: "Vehicle Model",
      key: "vehicleModel",
      render: (_, record) => record.vehicle?.model || "N/A",
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <strong style={{ color: "#52c41a" }}>
          {record.vehicle?.price?.toLocaleString()} VND
        </strong>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue";
        let icon = <></>;
        switch (status?.toLowerCase()) {
          case "active":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "pending":
            color = "processing";
            icon = <ClockCircleOutlined />;
            break;
          case "rejected":
            color = "error";
            icon = <CloseCircleOutlined />;
            break;
          case "expired":
            color = "warning";
            icon = <ClockCircleOutlined />;
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "1",
            label: "View Details",
            icon: <EyeOutlined />,
          },
          {
            key: "2",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
          },
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: (info: any) => {
                info.domEvent.stopPropagation();
                switch (info.key) {
                  case "1":
                    handleShowDetailModal(record);
                    break;
                  case "2":
                    handleDelete(record);
                    break;
                }
              },
            }}
          >
            <Button
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const filteredUserPosts = useMemo(() => {
    if (!searchText) return userPosts;
    const lowercasedFilter = searchText.toLowerCase();
    return userPosts.filter(
      (item) =>
        item.title?.toLowerCase().includes(lowercasedFilter) ||
        item.description?.toLowerCase().includes(lowercasedFilter) ||
        item.vehicle?.brand?.toLowerCase().includes(lowercasedFilter) ||
        item.vehicle?.model?.toLowerCase().includes(lowercasedFilter)
    );
  }, [userPosts, searchText]);

  const handleTableChange: TableProps<UserPostCustom>["onChange"] = (
    newPagination
  ) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            User Posts Management
          </Title>
          <Text type="secondary">{pagination.total} User Posts</Text>
        </div>
        <Space>
          <Input
            placeholder="Search by title, description, brand..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUserPosts}
        rowKey={(record) =>
          record.userPostId?.toString() ||
          `user-${record.userName}-${Math.random()}`
        }
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowClassName="cursor-pointer"
      />

      {/* Modal cho Chi tiết */}
      <UserPostDetailModal
        visible={isDetailVisible}
        onCancel={handleDetailModalCancel}
        userPost={selectedUserPost}
      />
    </div>
  );
};

export default AdminUserPostPage;
