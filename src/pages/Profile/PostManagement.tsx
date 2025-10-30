import { message, Modal } from "antd";
import {
  Calendar,
  Car,
  CheckCircle,
  DollarSign,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserPostCustom } from "../../entities/UserPost";
import { deleteUserPost, getAllUserPosts } from "../../features/Post/index";
import SoldConfirmModal from "../../Widgets/components/SoldConfirmModal.tsx";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import UserSidebar from "../../Widgets/UserSidebar/UserSidebar.tsx";
import VehiclePostForm from "../../Widgets/components/CreateVehiclePostForm.tsx";

const MyPostsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<UserPostCustom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Active" | "Inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<UserPostCustom | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, [currentPage, searchTerm]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);

      const userId = parseInt(localStorage.getItem("userId") || "0");
      if (!userId) {
        message.error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        return;
      }
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng.");
        return;
      }

      const result = await getAllUserPosts({
        page: currentPage,
        pageSize: 10,
        userId: userId,
      });

      if (result && result.items) {
        const filtered = result.items.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPosts(filtered);
        setTotalPages(Math.ceil(result.totalCount / 10) || 1);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = (post: UserPostCustom) => {
    setSelectedPost(post);
    setShowSoldModal(true);
  };

  const confirmMarkAsSold = async () => {
    if (!selectedPost) return;
    try {
      const result = await deleteUserPost(selectedPost.userPostId!);
      if (result) {
        message.success("Đã đánh dấu bài viết là đã bán!");

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.userPostId === selectedPost.userPostId
              ? { ...post, status: "Inactive" as any }
              : post
          )
        );
        setFilterStatus((prev) => (prev === "Active" ? "all" : prev));
      }
    } catch (error) {
      message.error("Lỗi khi đánh dấu bài viết là đã bán.");
      console.error(error);
    } finally {
      setShowSoldModal(false);
      setSelectedPost(null);
    }
  };

  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) : "—";
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const filteredPosts =
    filterStatus === "all"
      ? posts
      : posts.filter((post) => post.status === filterStatus);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <UserSidebar />
        <div className="flex-grow bg-gray-50 overflow-auto">
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Bài viết của tôi
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Quản lý tất cả bài đăng bán xe của bạn
                    </p>
                  </div>
                 <button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-200"
                    onClick={() => setShowAddPostModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                    Đăng bài mới
                  </button>
                </div>

                {/* Search + Filter */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        filterStatus === "all"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilterStatus("Active")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        filterStatus === "Active"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300"
                      }`}
                    >
                      Đang bán
                    </button>
                    <button
                      onClick={() => setFilterStatus("Inactive")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        filterStatus === "Inactive"
                          ? "bg-gray-600 text-white shadow-md"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Đã bán
                    </button>
                    <button
                      onClick={() => fetchUserPosts()}
                      className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <p className="text-gray-500">Đang tải bài viết...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chưa có bài viết nào
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Bắt đầu đăng bài để bán xe của bạn
                  </p>
                  <button
                    onClick={() => navigate("/AddPost")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Đăng bài ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.userPostId}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-200"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-48 h-48 flex-shrink-0 bg-gray-200 relative">
                          {post.images && post.images.length > 0 ? (
                            <img
                              src={post.images[0]}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                post.status === "Active"
                                  ? "bg-green-500 text-white"
                                  : post.status === "Inactive"
                                  ? "bg-gray-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              {post.status === "Active"
                                ? "Đang bán"
                                : post.status === "Inactive"
                                ? "Đã bán"
                                : post.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>

                          {post.vehicle && (
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Car className="w-4 h-4" />
                                <span>
                                  {post.vehicle.brand} {post.vehicle.model}
                                </span>
                                {post.vehicle.year && (
                                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                    {post.vehicle.year}
                                  </span>
                                )}
                              </div>

                              {post.vehicle.price && (
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                  <DollarSign className="w-4 h-4" />
                                  <span>
                                    {formatPrice(post.vehicle.price)} VNĐ
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>234 lượt xem</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/userpost/${post.userPostId}`)
                              }
                              className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </button>

                            {post.status === "Active" && (
                              <button
                                onClick={() => handleMarkAsSold(post)}
                                className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Đã bán
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-400 transition-all"
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-md"
                          : "border-2 border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-400 transition-all"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>

            <SoldConfirmModal
              visible={showSoldModal}
              post={selectedPost}
              onCancel={() => setShowSoldModal(false)}
              onConfirm={confirmMarkAsSold}
            />

            <Modal
              title="Đăng bài bán xe"
              open={showAddPostModal}
              onCancel={() => setShowAddPostModal(false)}
              footer={null}
              width={800}
              centered
              destroyOnClose
            >
              <VehiclePostForm
                onSuccess={() => {
                  setShowAddPostModal(false);
                  fetchUserPosts();
                }}
                onCancel={() => setShowAddPostModal(false)}
              />
            </Modal>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyPostsManagement;