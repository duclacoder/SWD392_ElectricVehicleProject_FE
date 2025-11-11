import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import {
  Avatar,
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
  AdminVehicle,
  AdminVehicleFormData,
} from "../../../entities/AdminVehicle";
import {
  createAdminVehicle,
  deleteAdminVehicle,
  getAllAdminVehicles,
  unDeleteAdminVehicle,
  updateAdminVehicle,
} from "../../../features/Admin/api/adminVehicleApi";
import { VehicleDetailModal } from "../../../Widgets/components/VehicleDetailModal";
import { VehicleFormModal } from "../../../Widgets/components/VehicleFormModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminVehiclePage = () => {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(
    null
  );

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    const currentPage = pagination.current;
    const currentSize = pagination.pageSize;
    try {
      const result = await getAllAdminVehicles(
        currentPage,
        currentSize
      );
      if (result) {
        setVehicles(result.items);
        setPagination((prev) => ({ ...prev, total: result.totalCount }));
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleShowAddModal = () => {
    setEditingVehicle(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = (vehicle: AdminVehicle) => {
    setEditingVehicle(vehicle);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingVehicle(null);
  };

  const handleModalSubmit = async (values: AdminVehicleFormData) => {
    setSubmitLoading(true);
    let success = false;
    if (editingVehicle) {
      success = await updateAdminVehicle(editingVehicle.vehiclesId, values);
    } else {
      success = await createAdminVehicle(values);
    }

    if (success) {
      setIsModalVisible(false);
      setEditingVehicle(null);
      fetchVehicles();
    }
    setSubmitLoading(false);
  };

  const handleShowDetailModal = (vehicle: AdminVehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailVisible(false);
  };

  const handleDelete = (vehicle: AdminVehicle) => {
    confirm({
      title: `Are you sure you want to delete ${vehicle.vehicleName}?`,
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const success = await deleteAdminVehicle(vehicle.vehiclesId);
        if (success) {
          fetchVehicles();
        }
      },
    });
  };

  const handleUnDelete = (vehicle: AdminVehicle) => {
    confirm({
      title: `Are you sure you want to undelete ${vehicle.vehicleName}?`,
      content: "This vehicle will be restored.",
      okText: "Yes, undelete it",
      okType: "primary",
      cancelText: "No",
      onOk: async () => {
        const success = await unDeleteAdminVehicle(vehicle.vehiclesId);
        if (success) {
          fetchVehicles();
        }
      },
    });
  };

  const columns: TableProps<AdminVehicle>["columns"] = [
    {
      title: "Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
      sorter: (a, b) => a.vehicleName.localeCompare(b.vehicleName),
      render: (text, record) => (
        <Space>
          <Avatar src={record.imageUrl} icon={<CarOutlined />} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => `${price.toLocaleString()} ${record.currency}`,
      sorter: (a, b) => a.price - b.price,
    },
    // {
    //   title: "Verified",
    //   key: "verified",
    //   dataIndex: "verified",
    //   render: (verified) => (
    //     <Tag
    //       icon={verified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
    //       color={verified ? "success" : "error"}
    //     >
    //       {verified ? "Verified" : "Not Verified"}
    //     </Tag>
    //   ),
    // },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue";
        let icon = <></>;

        switch (status?.toLowerCase()) {
          case "approved":
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
          case "deleted":
            color = "error";
            icon = <DeleteOutlined />;
            break;
          case "admin":
            color = "blue";
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
        const isDeleted = record.status?.toLowerCase() === "deleted";

        const menuItems = [
          {
            key: "1",
            label: "View Details",
            icon: <EyeOutlined />,
          },
          {
            key: "2",
            label: "Edit",

            disabled: isDeleted,
          },
          isDeleted
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
                    if (!isDeleted) handleShowEditModal(record);
                    break;
                  case "3":
                    if (isDeleted) handleUnDelete(record);
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

  const filteredVehicles = useMemo(() => {
    if (!searchText) return vehicles;
    const lowercasedFilter = searchText.toLowerCase();
    return vehicles.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [vehicles, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTableChange: TableProps<AdminVehicle>["onChange"] = (
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
            Vehicles Management
          </Title>
          <Text type="secondary">
            {pagination.total} Vehicles (All Statuses)
          </Text>
        </div>
        <Space>
          <Input
            placeholder="Search vehicles..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }} style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleShowAddModal}
          >
            Add vehicle
          </Button>
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredVehicles}
        rowKey="vehiclesId"
        loading={loading}
        pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}        onChange={handleTableChange}
        onRow={(record) => {
          return {
            onClick: () => {
              handleShowDetailModal(record);
            },
          };
        }}
        rowClassName="cursor-pointer"
      />

      <VehicleFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingVehicle}
        loading={submitLoading}
      />

      <VehicleDetailModal
        visible={isDetailVisible}
        onCancel={handleDetailModalCancel}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default AdminVehiclePage;
