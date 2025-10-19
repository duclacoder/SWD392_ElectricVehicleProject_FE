// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, Typography, Spin, message, Button, Image, Row, Col } from "antd";
// import { ArrowLeftOutlined } from "@ant-design/icons";
// import { getUserPostById } from "../../features/Post";
// import { Header } from "../../Widgets/Headers/Header";
// import { Footer } from "../../Widgets/Footers/Footer";
// import type { UserPostCustom } from "../../entities/UserPost";

// const { Title, Text, Paragraph } = Typography;

// const PostDetail: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     const [post, setPost] = useState<UserPostCustom | null>(null);
//     const [loading, setLoading] = useState(false);

//     const fetchPost = async () => {
//         try {
//             setLoading(true);
//             if (!id) return;

//             const data = await getUserPostById(Number(id));
//             if (data) {
//                 setPost(data);
//             } else {
//                 message.error("Không tìm thấy bài đăng.");
//             }
//         } catch (error) {
//             console.error(error);
//             message.error("Đã xảy ra lỗi khi tải chi tiết bài đăng.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPost();
//     }, [id]);

//     return (
//         <>
//             <Header />

//             <div className="container mx-auto px-4 py-8">
//                 {loading ? (
//                     <div className="flex justify-center items-center min-h-[400px]">
//                         <Spin size="large" />
//                     </div>
//                 ) : post ? (
//                     <Card
//                         className="shadow-xl rounded-2xl max-w-6xl mx-auto transition-all duration-300 hover:shadow-2xl"
//                         bodyStyle={{ padding: "32px" }}
//                         cover={
//                             post.images && post.images.length > 0 ? (
//                                 <Image.PreviewGroup>
//                                     <Row gutter={[16, 16]}>
//                                         {post.images.map((img, index) => (
//                                             <Col xs={24} sm={12} md={8} key={index}>
//                                                 <Image
//                                                     src={img}
//                                                     alt={`image-${index}`}
//                                                     style={{
//                                                         height: 200,
//                                                         objectFit: "cover",
//                                                         width: "100%",
//                                                         borderRadius: 12,
//                                                         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                                                     }}
//                                                 />
//                                             </Col>
//                                         ))}
//                                     </Row>
//                                 </Image.PreviewGroup>
//                             ) : (
//                                 <img
//                                     src="https://via.placeholder.com/800x400?text=No+Image"
//                                     alt="no image"
//                                     style={{ width: "100%", borderRadius: 12 }}
//                                 />
//                             )
//                         }
//                     >
//                         <Title level={3} className="text-center mb-6">
//                             {post.title}
//                         </Title>

//                         <Paragraph>
//                             <Text strong>Người đăng:</Text> {post.userName}
//                         </Paragraph>

//                         <Row gutter={[24, 24]}>
//                             <Col xs={24} md={12}>
//                                 <Paragraph>
//                                     <Text strong>Giá:</Text>{" "}
//                                     {post.vehicle?.price
//                                         ? post.vehicle.price.toLocaleString()
//                                         : "Chưa cập nhật"}{" "}
//                                     VND
//                                 </Paragraph>
//                                 <Paragraph>
//                                     <Text strong>Hãng xe:</Text> {post.vehicle?.brand || "N/A"} <br />
//                                     <Text strong>Mẫu xe:</Text> {post.vehicle?.model || "N/A"} <br />
//                                     <Text strong>Năm:</Text> {post.vehicle?.year || "N/A"} <br />
//                                     <Text strong>Màu sắc:</Text> {post.vehicle?.color || "N/A"} <br />
//                                     <Text strong>Loại thân xe:</Text> {post.vehicle?.bodyType || "N/A"}
//                                 </Paragraph>
//                             </Col>

//                             <Col xs={24} md={12}>
//                                 <Paragraph>
//                                     <Text strong>Mô tả:</Text>{" "}
//                                     {post.vehicle?.description || "Chưa có mô tả chi tiết."}
//                                 </Paragraph>
//                             </Col>
//                         </Row>

//                         <div className="flex justify-center mt-8">
//                             <Button
//                                 type="primary"
//                                 icon={<ArrowLeftOutlined />}
//                                 size="large"
//                                 onClick={() => navigate(-1)}
//                             >
//                                 Quay lại danh sách
//                             </Button>
//                         </div>
//                     </Card>
//                 ) : (
//                     <Text style={{ display: "block", textAlign: "center" }}>
//                         Không tìm thấy bài đăng.
//                     </Text>
//                 )}
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default PostDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, message, Button, Image, Row, Col, Tag, Divider } from "antd";
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, CarOutlined } from "@ant-design/icons";
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

    // Format price với VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <>
            <Header />

            <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                ) : post ? (
                    <div className="max-w-6xl mx-auto">
                        {/* Nút quay lại */}
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            className="mb-4 flex items-center text-gray-600 hover:text-blue-600"
                        >
                            Quay lại
                        </Button>

                        <Card
                            className="shadow-xl rounded-2xl overflow-hidden border-0"
                            bodyStyle={{ padding: 0 }}
                        >
                            {/* Phần hình ảnh */}
                            <div className="bg-white p-6">
                                {post.images && post.images.length > 0 ? (
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
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            transition: "transform 0.3s ease",
                                                        }}
                                                        className="hover:transform hover:scale-105 cursor-pointer"
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Image.PreviewGroup>
                                ) : (
                                    <div className="text-center py-12">
                                        <CarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                                        <p className="text-gray-400 mt-4">Không có hình ảnh</p>
                                    </div>
                                )}
                            </div>

                            <Divider className="my-0" />

                            {/* Phần thông tin chính */}
                            <div className="bg-white p-8">
                                <div className="text-center mb-8">
                                    <Title level={1} className="text-3xl font-bold text-gray-800 mb-2">
                                        {post.title}
                                    </Title>
                                    <div className="flex justify-center items-center gap-4 text-gray-600">
                                        <div className="flex items-center">
                                            <UserOutlined className="mr-2" />
                                            <Text>{post.userName}</Text>
                                        </div>
                                        {post.vehicle?.year && (
                                            <div className="flex items-center">
                                                <CalendarOutlined className="mr-2" />
                                                <Text>{post.vehicle.year}</Text>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Giá xe nổi bật */}
                                <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                                    <Text className="text-gray-600 text-lg">Giá bán</Text>
                                    <Title level={2} className="text-4xl font-bold text-blue-600 my-2">
                                        {post.vehicle?.price ? formatPrice(post.vehicle.price) : "Liên hệ"}
                                    </Title>
                                    {post.vehicle?.price && (
                                        <Text className="text-gray-500">
                                            ({post.vehicle.price.toLocaleString()} VND)
                                        </Text>
                                    )}
                                </div>

                                <Row gutter={[32, 32]}>
                                    {/* Thông tin chi tiết xe */}
                                    <Col xs={24} lg={12}>
                                        <Card
                                            title={
                                                <div className="flex items-center">
                                                    <CarOutlined className="mr-2 text-blue-600" />
                                                    <span className="text-lg font-semibold">Thông tin chi tiết xe</span>
                                                </div>
                                            }
                                            className="shadow-md border-0 rounded-xl"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <Text strong className="text-gray-700">Hãng xe</Text>
                                                    <Tag color="blue" className="text-sm">
                                                        {post.vehicle?.brand || "N/A"}
                                                    </Tag>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <Text strong className="text-gray-700">Mẫu xe</Text>
                                                    <Text>{post.vehicle?.model || "N/A"}</Text>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <Text strong className="text-gray-700">Năm sản xuất</Text>
                                                    <Tag color="green" className="text-sm">
                                                        {post.vehicle?.year || "N/A"}
                                                    </Tag>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <Text strong className="text-gray-700">Màu sắc</Text>
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                                            style={{
                                                                backgroundColor: post.vehicle?.color?.toLowerCase() === 'xanh lam' ? '#1890ff' :
                                                                    post.vehicle?.color?.toLowerCase() === 'đỏ' ? '#ff4d4f' :
                                                                        post.vehicle?.color?.toLowerCase() === 'trắng' ? '#ffffff' :
                                                                            post.vehicle?.color?.toLowerCase() === 'đen' ? '#000000' : '#d9d9d9'
                                                            }}
                                                        />
                                                        <Text>{post.vehicle?.color || "N/A"}</Text>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <Text strong className="text-gray-700">Loại thân xe</Text>
                                                    <Text>{post.vehicle?.bodyType || "N/A"}</Text>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>

                                    {/* Mô tả bài đăng */}
                                    <Col xs={24} lg={12}>
                                        <Card
                                            title={
                                                <span className="text-lg font-semibold">Mô tả bài đăng</span>
                                            }
                                            className="shadow-md border-0 rounded-xl h-full"
                                        >
                                            <Paragraph className="text-gray-700 leading-relaxed text-justify">
                                                {post.vehicle?.description && post.vehicle.description !== "Chưa có mô tả chi tiết."
                                                    ? post.vehicle.description
                                                    : "Xe đã qua sử dụng, bảo dưỡng định kỳ đầy đủ. Xe được bảo quản tốt, sạch sẽ, động cơ hoạt động ổn định. Liên hệ trực tiếp để biết thêm thông tin chi tiết và đặt lịch xem xe."
                                                }
                                            </Paragraph>
                                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <Text className="text-yellow-700 text-sm">
                                                    💡 <strong>Lưu ý:</strong> Nên kiểm tra xe trực tiếp và đầy đủ giấy tờ trước khi mua.
                                                </Text>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Nút hành động */}
                                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="bg-blue-600 hover:bg-blue-700 border-0 font-semibold h-12 px-8 rounded-xl"
                                    >
                                        📞 Liên hệ ngay
                                    </Button>
                                    <Button
                                        size="large"
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => navigate(-1)}
                                        className="font-semibold h-12 px-8 rounded-xl border-gray-300"
                                    >
                                        Quay lại danh sách
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Title level={3} className="text-gray-600 mb-4">
                            Không tìm thấy bài đăng
                        </Title>
                        <Button
                            type="primary"
                            onClick={() => navigate(-1)}
                            className="rounded-lg"
                        >
                            Quay lại danh sách
                        </Button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default PostDetail;