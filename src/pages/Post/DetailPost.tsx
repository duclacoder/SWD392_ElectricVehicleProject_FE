import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, message, Button, Image, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUserPostById } from "../../features/Post";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import type { UserPostCustom } from "../../entities/UserPost";

const { Title, Text, Paragraph } = Typography;

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<UserPostCustom | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPost = async () => {
        try {
            setLoading(true);
            if (!id) return;

            const data = await getUserPostById(Number(id));
            if (data) {
                setPost(data);
            } else {
                message.error("Không tìm thấy bài đăng.");
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi khi tải chi tiết bài đăng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                ) : post ? (
                    <Card
                        className="shadow-xl rounded-2xl max-w-6xl mx-auto transition-all duration-300 hover:shadow-2xl"
                        bodyStyle={{ padding: "32px" }}
                        cover={
                            post.images && post.images.length > 0 ? (
                                <Image.PreviewGroup>
                                    <Row gutter={[16, 16]}>
                                        {post.images.map((img, index) => (
                                            <Col xs={24} sm={12} md={8} key={index}>
                                                <Image
                                                    src={img}
                                                    alt={`image-${index}`}
                                                    style={{
                                                        height: 200,
                                                        objectFit: "cover",
                                                        width: "100%",
                                                        borderRadius: 12,
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                    }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Image.PreviewGroup>
                            ) : (
                                <img
                                    src="https://via.placeholder.com/800x400?text=No+Image"
                                    alt="no image"
                                    style={{ width: "100%", borderRadius: 12 }}
                                />
                            )
                        }
                    >
                        <Title level={3} className="text-center mb-6">
                            {post.title}
                        </Title>

                        <Paragraph>
                            <Text strong>Người đăng:</Text> {post.userName}
                        </Paragraph>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Paragraph>
                                    <Text strong>Giá:</Text>{" "}
                                    {post.vehicle?.price
                                        ? post.vehicle.price.toLocaleString()
                                        : "Chưa cập nhật"}{" "}
                                    VND
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>Hãng xe:</Text> {post.vehicle?.brand || "N/A"} <br />
                                    <Text strong>Mẫu xe:</Text> {post.vehicle?.model || "N/A"} <br />
                                    <Text strong>Năm:</Text> {post.vehicle?.year || "N/A"} <br />
                                    <Text strong>Màu sắc:</Text> {post.vehicle?.color || "N/A"} <br />
                                    <Text strong>Loại thân xe:</Text> {post.vehicle?.bodyType || "N/A"}
                                </Paragraph>
                            </Col>

                            <Col xs={24} md={12}>
                                <Paragraph>
                                    <Text strong>Mô tả:</Text>{" "}
                                    {post.vehicle?.description || "Chưa có mô tả chi tiết."}
                                </Paragraph>
                            </Col>
                        </Row>

                        <div className="flex justify-center mt-8">
                            <Button
                                type="primary"
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                onClick={() => navigate(-1)}
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Text style={{ display: "block", textAlign: "center" }}>
                        Không tìm thấy bài đăng.
                    </Text>
                )}
            </div>

            <Footer />
        </>
    );
};

export default PostDetail;