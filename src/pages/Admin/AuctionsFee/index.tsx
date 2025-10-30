import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EyeOutlined,
  MoreOutlined,
  RollbackOutlined,
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
import type {
  AuctionsFee,
  AuctionsFeeFormData,
} from "../../../entities/AuctionsFee";
import {
  createAuctionsFee,
  deleteAuctionsFee,
  getAllAuctionsFees,
  unDeleteAuctionsFee,
  updateAuctionsFee,
} from "../../../features/Admin/api/adminAuctionsFeeApi";
import { AuctionsFeeDetailModal } from "../../../Widgets/components/AuctionsFeeDetailModal";
import { AuctionsFeeFormModal } from "../../../Widgets/components/AuctionsFeeFormModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminAuctionsFeePage = () => {
  const [fees, setFees] = useState<AuctionsFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // State cho modal Cập nhật/Tạo mới
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFee, setEditingFee] = useState<AuctionsFee | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State cho modal Chi tiết
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<AuctionsFee | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllAuctionsFees(
        pagination.current,
        pagination.pageSize
      );
      if (result) {
        setFees(result.items);
        setPagination((prev) => ({ ...prev, total: result.totalCount }));
      }
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // --- Handlers cho modal Cập nhật/Tạo mới ---
  const handleShowAddModal = () => {
    setEditingFee(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = (fee: AuctionsFee) => {
    setEditingFee(fee);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingFee(null);
  };

  const handleModalSubmit = async (values: AuctionsFeeFormData) => {
    setSubmitLoading(true);
    let success = false;
    if (editingFee) {
      success = await updateAuctionsFee(editingFee.auctionsFeeId, values);
    } else {
      success = await createAuctionsFee(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingFee(null);
      fetchFees();
    }
    setSubmitLoading(false);
  };

  // --- Handlers cho modal Chi tiết ---
  const handleShowDetailModal = (fee: AuctionsFee) => {
    setSelectedFee(fee);
    setIsDetailVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailVisible(false);
  };

  // --- Handler cho Delete/Undelete ---
  const handleDelete = (fee: AuctionsFee) => {
    confirm({
      title: `Are you sure you want to delete this fee?`,
      content: "This action will set the status to Inactive.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const success = await deleteAuctionsFee(fee.auctionsFeeId);
        if (success) {
          fetchFees();
        }
      },
    });
  };

  const handleUnDelete = (fee: AuctionsFee) => {
    confirm({
      title: `Are you sure you want to undelete this fee?`,
      content: "This action will set the status to Active.",
      okText: "Yes, undelete it",
      okType: "primary",
      cancelText: "No",
      onOk: async () => {
        const success = await unDeleteAuctionsFee(fee.auctionsFeeId);
        if (success) {
          fetchFees();
        }
      },
    });
  };

  // Cập nhật columns cho AuctionsFee
  const columns: TableProps<AuctionsFee>["columns"] = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Space>
          <DollarOutlined />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Entry Fee",
      dataIndex: "entryFee",
      key: "entryFee",
      render: (price, record) => `${price.toLocaleString()} ${record.currency}`,
      sorter: (a, b) => a.entryFee - b.entryFee,
    },
    {
      title: "Fee Per Minute",
      dataIndex: "feePerMinute",
      key: "feePerMinute",
      render: (price, record) => `${price.toLocaleString()} ${record.currency}`,
      sorter: (a, b) => a.feePerMinute - b.feePerMinute,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        const isInactive = status?.toLowerCase() === "inactive";
        return (
          <Tag
            icon={
              isInactive ? <CloseCircleOutlined /> : <CheckCircleOutlined />
            }
            color={isInactive ? "error" : "success"}
          >
            {isInactive ? "Inactive" : "Active"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const isInactive = record.status?.toLowerCase() === "inactive";

        const menuItems = [
          {
            key: "1",
            label: "View Details",
            icon: <EyeOutlined />,
          },
          {
            key: "2",
            label: "Edit",
            disabled: isInactive, // Không thể sửa fee đã xóa
          },
          // Hiển thị Delete hoặc Undelete
          isInactive
            ? {
                key: "3",
                label: "Undelete",
                icon: <RollbackOutlined />,
              }
            : {
                key: "3",
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
                    if (!isInactive) handleShowEditModal(record);
                    break;
                  case "3":
                    if (isInactive) handleUnDelete(record);
                    else handleDelete(record);
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

  const filteredFees = useMemo(() => {
    if (!searchText) return fees;
    const lowercasedFilter = searchText.toLowerCase();
    return fees.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [fees, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTableChange: TableProps<AuctionsFee>["onChange"] = (
    newPagination
  ) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
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
            Auctions Fee Management
          </Title>
          <Text type="secondary">{pagination.total} Fees</Text>
        </div>
        <Space>
          <Input
            placeholder="Search fees by description, type..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleShowAddModal}
          >
            Add Fee
          </Button> */}
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredFees}
        rowKey="auctionsFeeId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={(record) => {
          return {
            onClick: () => {
              handleShowDetailModal(record);
            },
          };
        }}
        rowClassName="cursor-pointer"
      />

      {/* Modal cho Cập nhật/Tạo mới */}
      <AuctionsFeeFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingFee}
        loading={submitLoading}
      />

      {/* RENDER MODAL CHI TIẾT */}
      <AuctionsFeeDetailModal
        visible={isDetailVisible}
        onCancel={handleDetailModalCancel}
        fee={selectedFee}
      />
    </div>
  );
};

export default AdminAuctionsFeePage;
