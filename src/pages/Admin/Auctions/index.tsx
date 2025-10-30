import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Dropdown, Input, Space, Table, Tag, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AuctionCustom } from "../../../entities/Auction";
import type { CreateAuctionWithAutoFeeFormData } from "../../../features/Admin/api/adminAuctionApi";
import {
  createAuctionWithAutoFee,
  getAllAuctions,
  getAuctionById,
  updateAuction,
} from "../../../features/Admin/api/adminAuctionApi";
import { AuctionDetailModal } from "../../../Widgets/components/AuctionDetailModal";
import { AuctionFormModal } from "../../../Widgets/components/AuctionFormModal";

const { Title, Text } = Typography;

const AdminAuctionPage = () => {
  const [auctions, setAuctions] = useState<AuctionCustom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // State cho modal Cập nhật/Tạo mới
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAuction, setEditingAuction] = useState<AuctionCustom | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  // State cho modal Chi tiết
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionCustom | null>(
    null
  );

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllAuctions(
        pagination.current,
        pagination.pageSize
      );
      if (result) {
        setAuctions(result.items);
        setPagination((prev) => ({ ...prev, total: result.totalCount }));
      }
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // --- Handlers cho modal Cập nhật/Tạo mới ---
  const handleShowAddModal = () => {
    setEditingAuction(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = async (auction: AuctionCustom) => {
    const fullAuction = await getAuctionById(auction.auctionId);
    if (fullAuction) {
      setEditingAuction(fullAuction);
      setIsModalVisible(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingAuction(null);
  };

  const handleModalSubmit = async (
    values: CreateAuctionWithAutoFeeFormData
  ) => {
    setSubmitLoading(true);
    let success = false;

    if (editingAuction) {
      // Update existing auction - only endTime and status
      success = await updateAuction(editingAuction.auctionId, {
        endTime: values.endTime,
        status: "Active", // Fixed status for update
      });
    } else {
      // Create new auction
      success = await createAuctionWithAutoFee(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingAuction(null);
      fetchAuctions(); // Tải lại danh sách
    }
    setSubmitLoading(false);
  };

  // --- Handlers cho modal Chi tiết ---
  const handleShowDetailModal = (auction: AuctionCustom) => {
    setSelectedAuction(auction);
    setIsDetailVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailVisible(false);
    setSelectedAuction(null);
  };

  // Cập nhật columns cho Auctions
  const columns: TableProps<AuctionCustom>["columns"] = [
    {
      title: "Auction ID",
      dataIndex: "auctionId",
      key: "auctionId",
      sorter: (a, b) => a.auctionId - b.auctionId,
    },
    {
      title: "Seller",
      dataIndex: "sellerUserName",
      key: "sellerUserName",
    },
    {
      title: "Vehicle ID",
      dataIndex: "vehicleId",
      key: "vehicleId",
    },
    {
      title: "Start Price",
      dataIndex: "startPrice",
      key: "startPrice",
      render: (price) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.startPrice - b.startPrice,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => new Date(text).toLocaleString(),
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
          case "ended":
            color = "error";
            icon = <CloseCircleOutlined />;
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
            label: "Edit",
            icon: <EditOutlined />,
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
                    handleShowEditModal(record);
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

  const filteredAuctions = useMemo(() => {
    if (!searchText) return auctions;
    const lowercasedFilter = searchText.toLowerCase();
    return auctions.filter((item) =>
      item.sellerUserName.toLowerCase().includes(lowercasedFilter)
    );
  }, [auctions, searchText]);

  const handleTableChange: TableProps<AuctionCustom>["onChange"] = (
    newPagination
  ) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">
            Auctions Management
          </Title>
          <Text type="secondary">{pagination.total} Auctions</Text>
        </div>
        <Space>
          <Input
            placeholder="Search by seller..."
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
            Add Auction
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAuctions}
        rowKey="auctionId"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowClassName="cursor-pointer"
      />

      {/* Modal cho Cập nhật/Tạo mới */}
      <AuctionFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingAuction}
        loading={submitLoading}
      />

      {/* Modal cho Chi tiết */}
      <AuctionDetailModal
        visible={isDetailVisible}
        onCancel={handleDetailModalCancel}
        auction={selectedAuction}
      />
    </div>
  );
};

export default AdminAuctionPage;
