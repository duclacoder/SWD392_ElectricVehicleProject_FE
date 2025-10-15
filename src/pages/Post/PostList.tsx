import React, { useEffect, useState } from "react";
import { Card, Pagination, Spin, Typography, message, Row, Col } from "antd";
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
            <div className="container mx-auto px-4 py-8">
                <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                    Danh sách bài đăng xe
                </Title>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Spin size="large" />
                    </div>
                ) : posts.length === 0 ? (
                    <Text style={{ display: "block", textAlign: "center", marginTop: 32 }}>
                        Không có bài đăng nào.
                    </Text>
                ) : (
                    <Row gutter={[24, 24]}>
                        {posts.map((post) => (
                            <Col xs={24} sm={12} md={8} key={post.userPostId}>
                                <Card
                                    hoverable
                                    className="shadow-md rounded-2xl"
                                    cover={
                                        <img
                                            alt="vehicle"
                                            src={
                                                post.images && post.images.length > 0
                                                    ? post.images[0]
                                                    : "https://via.placeholder.com/400x250?text=No+Image"
                                            }
                                            style={{ height: 200, objectFit: "cover" }}
                                        />
                                    }
                                    onClick={() => navigate(`/userpost/${post.userPostId}`)}
                                >
                                    <Title level={4}>{post.title}</Title>
                                    <Text strong>Giá: </Text>
                                    <Text>
                                        {post.vehicle?.price
                                            ? post.vehicle.price.toLocaleString()
                                            : "Chưa cập nhật"}{" "}
                                        VND
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {post.vehicle?.brand || "Chưa cập nhật"} -{" "}
                                        {post.vehicle?.model || "Chưa cập nhật"} -{" "}
                                        {post.vehicle?.year || "Chưa cập nhật"}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {post.vehicle?.color || "Chưa cập nhật"} -{" "}
                                        {post.vehicle?.bodyType || "Chưa cập nhật"}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <div className="flex justify-center mt-8">
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
                        showTotal={(total) => `Tổng ${total} bài đăng`}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PostList;
