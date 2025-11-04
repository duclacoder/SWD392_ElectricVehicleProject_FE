import {
  Badge,
  Card,
  Col,
  message,
  Pagination,
  Row,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import type { UserPostCustom } from "../../entities/UserPost";
import { getAllUserPosts } from "../../features/Post";
import { Battery } from 'lucide-react'; // Sử dụng icon Pin

const { Title, Text } = Typography;

const BatteryPostList: React.FC = () => {
  const [posts, setPosts] = useState<UserPostCustom[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "Liên hệ";
    return price.toLocaleString('vi-VN');
  };

  const fetchPosts = async (page: number, pageSize: number) => {
    try {
      setLoading(true);

      // GỌI API CHỈ LẤY BÀI ĐĂNG PIN (isVehiclePost: false)
      const data = await getAllUserPosts({ page, pageSize, isVehiclePost: false, userId: undefined });

      if (data) {
        setPosts(data.items || []);
        setTotal(data.totalItems || 0);
      } else {
        message.error("Không thể tải danh sách bài đăng Pin.");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi tải danh sách bài đăng Pin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, pageSize);
  }, [page, pageSize]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Decorative Elements (Tông xanh lá/ngọc lục bảo) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-2xl">
              <Battery className="w-10 h-10 text-white" />
            </div>

            <Title
              level={1}
              className="!mb-4"
              style={{
                background:
                  "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "3.5rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Chợ Mua Bán Pin EV
            </Title>

            <Text className="text-xl text-gray-600 block mb-8">
              Tìm kiếm pin thay thế hoặc pin nâng cấp chất lượng cao
            </Text>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {total}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Pin Đang Bán
                </div>
              </div>

              <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Li-ion
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Đa Dạng Loại Pin
                </div>
              </div>

              <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                  18+
                </div>
                <div className="text-sm text-gray-600 font-medium">Thương Hiệu</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[500px]">
              <div className="relative">
                <Spin size="large" />
                <div className="absolute inset-0 blur-2xl bg-emerald-500/30 animate-pulse"></div>
              </div>
              <Text className="mt-6 text-lg text-gray-600 font-medium animate-pulse">
                Đang tải pin...
              </Text>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16">
              <div className="text-8xl mb-6">🔋</div>
              <Title level={3} className="!mb-2 text-gray-800">
                Chưa Có Bài Đăng Pin Nào
              </Title>
              <Text className="text-lg text-gray-500">
                Hãy quay lại sau hoặc thử mua gói đăng bài để chia sẻ pin của bạn
              </Text>
            </div>
          ) : (
            <>
              <Row gutter={[28, 28]}>
                {posts.map((post, index) => (
                  <Col xs={24} sm={12} lg={8} key={post.userPostId}>
                    <Card
                      hoverable
                      className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white/95 backdrop-blur-sm hover:-translate-y-2"
                      style={{
                        height: "100%",
                        opacity: 0,
                        animation: `fadeInUp 0.6s ease-out ${
                          index * 0.1
                        }s forwards`,
                      }}
                      cover={
                        <div className="relative overflow-hidden h-64">
                          <img
                            alt="battery"
                            src={
                              post.images && post.images.length > 0
                                ? post.images[0]
                                : "https://via.placeholder.com/400x300?text=Battery+Image"
                            }
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Dark Overlay on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Badge Trạng thái */}
                          <div className="absolute top-4 right-4">
                            <Badge
                              count={post.status === "Active" ? "CÒN HÀNG" : "HẾT HÀNG"}
                              style={{
                                backgroundColor: post.status === "Active" ? "#10b981" : "#ef4444",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "11px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              }}
                            />
                          </div>

                          {/* Quick View Button */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl border border-white/20">
                              <Text className="text-sm font-bold text-gray-800">
                                Xem Chi Tiết Pin →
                              </Text>
                            </div>
                          </div>
                        </div>
                      }
                      onClick={() => navigate(`/userpost/${post.userPostId}`)}
                    >
                      <div className="p-5">
                        <Title
                          level={4}
                          className="!mb-5 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300 !text-lg !font-bold leading-snug"
                        >
                          {post.title}
                        </Title>

                        {/* Price Section */}
                        <div className="mb-5 p-5 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-100/50 shadow-sm">
                          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Giá bán
                          </Text>
                          <div className="flex items-baseline gap-2">
                            <Text
                              strong
                              className="text-3xl font-black"
                              style={{
                                background:
                                  "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {formatPrice(post.battery?.price)}
                            </Text>
                            {post.battery?.price !== undefined && (
                              <Text className="text-sm font-semibold text-gray-500">
                                VND
                              </Text>
                            )}
                          </div>
                        </div>

                        {/* Battery Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-colors group/item">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                              <Battery className="w-5 h-5 text-white" />
                            </div>
                            <Text className="text-sm font-semibold text-gray-700 flex-1">
                              {post.battery?.brand || "N/A"}{" "}
                              ({post.battery?.capacity || "N/A"} Ah)
                            </Text>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl hover:bg-green-50 transition-colors group/item">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z" // Biểu tượng sét/điện áp
                                />
                              </svg>
                            </div>
                            <Text className="text-sm font-semibold text-gray-700 flex-1">
                              Điện áp: {post.battery?.voltage || "N/A"} V
                            </Text>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl hover:bg-teal-50 transition-colors group/item">
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <Text className="text-sm font-semibold text-gray-700 flex-1">
                              BH: {post.battery?.warrantyMonths || 0} tháng
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className="flex justify-center mt-16">
                <div className="bg-white/90 backdrop-blur-lg px-8 py-5 rounded-3xl shadow-2xl border border-gray-100">
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={(p, ps) => {
                      if (ps !== pageSize) {
                        setPageSize(ps);
                        setPage(1);
                      } else {
                        setPage(p);
                      }
                    }}
                    showSizeChanger
                    showTotal={(total) => (
                      <span className="text-gray-700 font-semibold">
                        Tổng{" "}
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 800,
                          }}
                        >
                          {total}
                        </span>{" "}
                        bài đăng
                      </span>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

      <Footer />
    </>
  );
};

export default BatteryPostList;