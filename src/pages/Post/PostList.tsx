import React, { useEffect, useState } from "react";
import { Card, Pagination, Spin, Typography, message, Row, Col, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import { getAllUserPosts } from "../../features/Post";
import type { UserPostCustom } from "../../entities/UserPost";

const { Title, Text } = Typography;

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<UserPostCustom[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const fetchPosts = async (page: number, pageSize: number) => {
        try {
            setLoading(true);

            // gọi API dùng tham số page-based pagination
            const data = await getAllUserPosts({ page, pageSize });

            if (data) {
                setPosts(data.items || []);
                setTotal(data.totalItems || 0);
            } else {
                message.error("Không thể tải danh sách bài đăng.");
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi khi tải danh sách bài đăng.");
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
                            <span className="text-4xl">🚗</span>
                        </div>

                        <Title
                            level={1}
                            className="!mb-4"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '3.5rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Khám Phá Xe Của Bạn
                        </Title>

                        <Text className="text-xl text-gray-600 block mb-8">
                            Tìm kiếm chiếc xe hoàn hảo từ hàng nghìn lựa chọn
                        </Text>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                            <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                    {total}+
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Xe Đang Bán</div>
                            </div>

                            <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                                    100%
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Xác Thực</div>
                            </div>

                            <div className="text-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                                    24/7
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Hỗ Trợ</div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center min-h-[500px]">
                            <div className="relative">
                                <Spin size="large" />
                                <div className="absolute inset-0 blur-2xl bg-blue-500/30 animate-pulse"></div>
                            </div>
                            <Text className="mt-6 text-lg text-gray-600 font-medium animate-pulse">
                                Đang tải xe của bạn...
                            </Text>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16">
                            <div className="text-8xl mb-6">🚗</div>
                            <Title level={3} className="!mb-2 text-gray-800">
                                Chưa Có Xe Nào
                            </Title>
                            <Text className="text-lg text-gray-500">
                                Hãy quay lại sau để khám phá thêm nhiều xe mới
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
                                                height: '100%',
                                                opacity: 0,
                                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                                            }}
                                            cover={
                                                <div className="relative overflow-hidden h-64">
                                                    <img
                                                        alt="vehicle"
                                                        src={
                                                            post.images && post.images.length > 0
                                                                ? post.images[0]
                                                                : "https://via.placeholder.com/400x300?text=No+Image"
                                                        }
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />

                                                    {/* Dark Overlay on Hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    {/* NEW Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <Badge
                                                            count="MỚI"
                                                            style={{
                                                                backgroundColor: '#fff',
                                                                color: '#3b82f6',
                                                                fontWeight: 'bold',
                                                                fontSize: '11px',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Quick View Button */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                                        <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl border border-white/20">
                                                            <Text className="text-sm font-bold text-gray-800">
                                                                Xem Chi Tiết →
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            onClick={() => navigate(`/userpost/${post.userPostId}`)}
                                        >
                                            <div className="p-5">
                                                <Title level={4} className="!mb-5 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 !text-lg !font-bold leading-snug">
                                                    {post.title}
                                                </Title>

                                                {/* Price Section */}
                                                <div className="mb-5 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-100/50 shadow-sm">
                                                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                                        Giá bán
                                                    </Text>
                                                    <div className="flex items-baseline gap-2">
                                                        <Text
                                                            strong
                                                            className="text-3xl font-black"
                                                            style={{
                                                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }}
                                                        >
                                                            {post.vehicle?.price
                                                                ? post.vehicle.price.toLocaleString()
                                                                : "Liên hệ"}
                                                        </Text>
                                                        {post.vehicle?.price && (
                                                            <Text className="text-sm font-semibold text-gray-500">VND</Text>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Vehicle Details */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group/item">
                                                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <Text className="text-sm font-semibold text-gray-700 flex-1">
                                                            {post.vehicle?.brand || "N/A"} {post.vehicle?.model || ""}
                                                        </Text>
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl hover:bg-purple-50 transition-colors group/item">
                                                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <Text className="text-sm font-semibold text-gray-700 flex-1">
                                                            Năm {post.vehicle?.year || "N/A"} • {post.vehicle?.color || "N/A"}
                                                        </Text>
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-colors group/item">
                                                        <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <Text className="text-sm font-semibold text-gray-700 flex-1">
                                                            {post.vehicle?.bodyType || "N/A"}
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
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        fontWeight: 800
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

export default PostList;