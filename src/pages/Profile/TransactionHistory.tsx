

import { useEffect, useState } from "react";
import { message, Spin, Empty, Tag, Card, Statistic, Pagination } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import { getPaymentsByUserId } from "../../features/Payment";
import type { Payment } from "../../entities/Payment";

export const TransactionHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    refunded: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Vui lòng đăng nhập để xem lịch sử thanh toán");
        return;
      }

      const response = await getPaymentsByUserId(Number(userId));
      if (response.isSuccess && response.result) {
        const sortedPayments = response.result.sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        );
        setPayments(sortedPayments);

        // Calculate statistics
        const paid = sortedPayments.filter((p) => p.status === "Paid").length;
        // const refunded = sortedPayments.filter(
        //   (p) => p.status === "Refunded"
        // ).length;
        const totalAmount = sortedPayments
          .filter((p) => p.status === "Paid")
          .reduce((sum, p) => sum + p.transferAmount, 0);

        const totalRefunded = sortedPayments
          .filter((p) => p.status === "Refunded")
          .reduce((sum, p) => sum + p.transferAmount, 0);

        setStats({
          total: sortedPayments.length,
          paid,
          refunded: totalRefunded,
          totalAmount,
        });
      }
    } catch (error) {
      message.error("Không thể tải lịch sử thanh toán");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success" className="px-2 py-1 text-sm font-medium">
            Đã thanh toán
          </Tag>
        );
      case "Refunded":
        return (
          <Tag icon={<DollarOutlined/>} color="warning" className="px-2 py-1 text-sm font-medium ">
            Đã hoàn tiền
          </Tag>
        );
      default:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error" className="px-3 py-1 text-sm font-medium">
            Thất bại
          </Tag>
        );
    }
  };

  const getReferenceTypeLabel = (type: string) => {
    switch (type) {
      case "AuctionFee":
        return "Phí đấu giá";
      case "UserPackage":
        return "Gói dịch vụ";
      default:
        return type;
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPayments = payments.slice(startIndex, endIndex);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-blue-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Page Header with gradient */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <HistoryOutlined className="text-3xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Lịch sử thanh toán
              </h1>
              <p className="text-blue-100">
                Quản lý và theo dõi các giao dịch của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <Statistic
              title={<span className="text-gray-600 font-medium">Tổng giao dịch</span>}
              value={stats.total}
              prefix={<CreditCardOutlined className="text-blue-500 text-2xl" />}
              valueStyle={{ color: "#2563eb", fontWeight: "bold", fontSize: "28px" }}
            />
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <Statistic
              title={<span className="text-gray-600 font-medium">Đã thanh toán</span>}
              value={stats.paid}
              prefix={<CheckCircleOutlined className="text-green-500 text-2xl" />}
              valueStyle={{ color: "#10b981", fontWeight: "bold", fontSize: "28px" }}
            />
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
            <Statistic
              title={<span className="text-gray-600 font-medium">Được hoàn trả</span>}
              value={stats.refunded}
              prefix={<ClockCircleOutlined className="text-yellow-500 text-2xl" />}
              valueStyle={{ color: "#f59e0b", fontWeight: "bold", fontSize: "28px" }}
            />
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            <Statistic
              title={<span className="text-gray-600 font-medium">Tổng chi tiêu</span>}
              value={stats.totalAmount}
              prefix={<DollarOutlined className="text-blue-600 text-2xl" />}
              valueStyle={{ color: "#1d4ed8", fontWeight: "bold", fontSize: "24px" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <Card className="shadow-lg rounded-xl border-0">
            <Empty
              description={
                <span className="text-gray-500 text-lg">
                  Chưa có giao dịch nào
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {currentPayments.map((payment, index) => (
                <Card
                  key={payment.paymentsId}
                  className="shadow-md hover:shadow-2xl transition-all duration-300 border-0 rounded-xl overflow-hidden"
                  style={{
                    borderLeft: "6px solid #3b82f6",
                    marginBottom: "6px",
                    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Payment ID & Status */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-medium">Mã giao dịch</span>
                      </div>
                      <div className="font-bold text-blue-600 text-lg mb-3">
                        #{payment.paymentsId}
                      </div>
                      {getStatusTag(payment.status)}
                    </div>

                    {/* Content & Type */}
                    <div className="md:col-span-3">
                      <div className="text-xs text-gray-500 font-medium mb-2">Nội dung</div>
                      <div className="font-semibold text-gray-800 mb-1">
                        {payment.content}
                      </div>
                      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {getReferenceTypeLabel(payment.referenceType)}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500 font-medium mb-2">Số tiền</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {formatCurrency(payment.transferAmount)}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500 font-medium mb-2">
                        Phương thức
                      </div>
                      <div className="font-semibold text-gray-800">
                        {payment.gateway || "Chưa thanh toán"}
                      </div>
                      {payment.accountNumber && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {payment.accountNumber}
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarOutlined className="text-blue-500" />
                        <span className="text-xs text-gray-500 font-medium">Thời gian</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {formatDate(payment.transactionDate)}
                      </div>
                      {payment.status === "Paid" && payment.updatedAt && (
                        <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircleOutlined />
                          <span>Xác nhận: {formatDate(payment.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={payments.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total, range) => (
                  <span className="text-gray-600 font-medium">
                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} giao dịch
                  </span>
                )}
                pageSizeOptions={['5', '10', '20', '50']}
                className="custom-pagination"
                style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </div>
          </>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-pagination .ant-pagination-item {
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          font-weight: 500;
        }

        .custom-pagination .ant-pagination-item-active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-color: #3b82f6;
        }

        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }

        .custom-pagination .ant-pagination-item:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next {
          border-radius: 8px;
        }

        .custom-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
        .custom-pagination .ant-pagination-next:hover .ant-pagination-item-link {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .custom-pagination .ant-pagination-options {
          margin-left: 16px;
        }

        .custom-pagination .ant-select-selector {
          border-radius: 8px !important;
          border: 2px solid #e5e7eb !important;
          font-weight: 500;
          padding: 4px 12px !important;
          height: auto !important;
        }

        .custom-pagination .ant-select-selector:hover {
          border-color: #3b82f6 !important;
        }

        .custom-pagination .ant-select-focused .ant-select-selector {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
        }

        .ant-select-dropdown {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .ant-select-item {
          border-radius: 6px !important;
          margin: 4px 8px !important;
          padding: 8px 12px !important;
          font-weight: 500;
        }

        .ant-select-item-option-selected {
          background-color: #eff6ff !important;
          color: #3b82f6 !important;
        }

        .ant-select-item-option-active {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};