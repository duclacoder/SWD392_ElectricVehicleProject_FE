import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, message, Button, Image, Row, Col, Tag, Divider, Carousel } from "antd";
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, CarOutlined, DashboardOutlined, EnvironmentOutlined, HomeOutlined, PhoneOutlined, EyeOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import { getUserPostById } from "../../features/Post";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import type { UserPostCustom } from "../../entities/UserPost";
import { getUserPostById } from "../../features/Post";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatPriceShort = (price: number) => {
        return Math.floor(price / 1000000);
    };

    return (
        <>
            <Header />

            <div className="bg-gray-50 min-h-screen py-6">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                ) : post ? (
                    <div className="container mx-auto px-4">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <HomeOutlined />
                            <span>›</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(-1)}>
                                Tin đăng
                            </span>
                            <span>›</span>
                            <span className="font-medium">{post.vehicle?.brand}</span>
                        </div>

                        {/* Location & Title */}
                        <div className="mb-4">
                            {/* <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <EnvironmentOutlined />
                                <Text className="text-gray-600">{post.userName || "Vị trí"}</Text>
                            </div> */}
                            <Title level={2} className="!mb-2 !text-3xl">
                                {post.title}
                            </Title>
                            <div className="flex gap-4 text-sm">
                                <Tag color="blue">Đời xe: {post.vehicle?.brand || "N/A"}</Tag>
                                {/* <Tag color="default">Odo: 44,000 km</Tag> */}
                            </div>
                        </div>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <Card className="!rounded-2xl !border-2 !border-blue-400 overflow-hidden mb-6 shadow-lg">
                                    {post.images && post.images.length > 0 ? (
                                        <>
                                            <Carousel autoplay>
                                                {post.images.map((img, index) => (
                                                    <div key={index}>
                                                        <Image
                                                            src={img}
                                                            alt={`image-${index}`}
                                                            style={{
                                                                width: "100%",
                                                                height: 450,
                                                                objectFit: "cover"
                                                            }}
                                                            preview={false}
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>

                                            <div className="mt-4">
                                                <Image.PreviewGroup>
                                                    <Row gutter={[12, 12]}>
                                                        {post.images.slice(0, 4).map((img, index) => (
                                                            <Col span={6} key={index}>
                                                                <Image
                                                                    src={img}
                                                                    alt={`thumb-${index}`}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: 100,
                                                                        objectFit: "cover",
                                                                        borderRadius: 8,
                                                                        cursor: "pointer"
                                                                    }}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Image.PreviewGroup>
                                                {post.images.length > 4 && (
                                                    <Button
                                                        type="link"
                                                        icon={<EyeOutlined />}
                                                        className="mt-2"
                                                    >
                                                        Xem tất cả {post.images.length} ảnh
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-20">
                                            <CarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                                            <p className="text-gray-400 mt-4">Không có hình ảnh</p>
                                        </div>
                                    )}
                                </Card>

                                {/* Thông tin xe cơ bản */}
                                <Card
                                    title={<span className="text-lg font-semibold">Thông tin xe cơ bản</span>}
                                    className="!rounded-xl shadow-md mb-6"
                                >
                                    <Row gutter={[16, 24]}>
                                        {/* <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <DashboardOutlined className="text-blue-500 text-xl mt-1" />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Công tơ mét</div>
                                                    <div className="font-semibold">44,000 km</div>
                                                </div>
                                            </div>
                                        </Col> */}
                                        <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <CalendarOutlined className="text-blue-500 text-xl mt-1" />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Năm sản xuất</div>
                                                    <div className="font-semibold">{post.vehicle?.year || "N/A"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <CarOutlined className="text-blue-500 text-xl mt-1" />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Hãng xe</div>
                                                    <div className="font-semibold">{post.vehicle?.brand || "N/A"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <CarOutlined className="text-blue-500 text-xl mt-1" />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Mẫu xe</div>
                                                    <div className="font-semibold">{post.vehicle?.model || "N/A"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <CarOutlined className="text-blue-500 text-xl mt-1" />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Kiểu dáng</div>
                                                    <div className="font-semibold">{post.vehicle?.bodyType || "Sedan"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-5 h-5 rounded-full mt-1 border-2 border-gray-300"
                                                    style={{
                                                        backgroundColor: post.vehicle?.color?.toLowerCase() === 'xanh lam' ? '#1890ff' :
                                                            post.vehicle?.color?.toLowerCase() === 'đỏ' ? '#ff4d4f' :
                                                                post.vehicle?.color?.toLowerCase() === 'trắng' ? '#ffffff' :
                                                                    post.vehicle?.color?.toLowerCase() === 'đen' ? '#000000' : '#d9d9d9'
                                                    }}
                                                />
                                                <div>
                                                    <div className="text-gray-500 text-sm">Màu sắc</div>
                                                    <div className="font-semibold">{post.vehicle?.color || "N/A"}</div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>

                                {/* Mô tả chi tiết */}
                                <Card
                                    title={<span className="text-lg font-semibold">Mô tả chi tiết</span>}
                                    className="!rounded-xl shadow-md"
                                >
                                    <Paragraph className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                                        {post.vehicle?.description && post.vehicle.description !== "Chưa có mô tả chi tiết."
                                            ? post.vehicle.description
                                            : "Xe đã qua sử dụng, bảo dưỡng định kỳ đầy đủ. Xe được bảo quản tốt, sạch sẽ, động cơ hoạt động ổn định. Liên hệ trực tiếp để biết thêm thông tin chi tiết và đặt lịch xem xe."
                                        }
                                    </Paragraph>

                                    <Divider />

                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <Text className="text-yellow-800">
                                            💡 <strong>Lưu ý:</strong> Nên kiểm tra xe trực tiếp và đầy đủ giấy tờ trước khi mua.
                                        </Text>
                                    </div>
                                </Card>
                            </Col>

                            {/* Right Column - Sidebar */}
                            <Col xs={24} lg={8}>
                                {/* Card giá bán */}
                                <Card className="!rounded-xl shadow-lg mb-6 bg-gradient-to-br from-blue-50 to-white sticky top-4">
                                    <div className="text-center mb-6">
                                        <div className="text-sm text-gray-600 mb-2">Giá bán</div>
                                        <div className="text-5xl font-bold text-blue-600 mb-1">
                                            {post.vehicle?.price ? formatPriceShort(post.vehicle.price) : "Liên hệ"}
                                            {post.vehicle?.price && <span className="text-2xl"> triệu</span>}
                                        </div>
                                        {post.vehicle?.price && (
                                            <div className="text-sm text-gray-500">
                                                {formatPrice(post.vehicle.price)}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        className="!h-12 !rounded-xl !text-base font-semibold mb-3"
                                    >
                                        📞 Liên hệ ngay
                                    </Button>

                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Button
                                                block
                                                icon={<HeartOutlined />}
                                                className="!h-10 !rounded-lg"
                                            >
                                                Yêu thích
                                            </Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button
                                                block
                                                icon={<ShareAltOutlined />}
                                                className="!h-10 !rounded-lg"
                                            >
                                                Chia sẻ
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    {/* Thông tin người đăng */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <UserOutlined className="text-blue-600 text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold">{post.userName}</div>
                                            <div className="text-sm text-gray-500">Người bán</div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Thông tin bổ sung */}
                                <Card
                                    title="Thông tin bổ sung"
                                    className="!rounded-xl shadow-md"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Trạng thái</span>
                                            <Tag color="green">Đang bán</Tag>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Loại tin</span>
                                            <span className="font-medium">Cá nhân</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Ngày đăng</span>
                                            <span className="font-medium">Hôm nay</span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Back Button */}
                        <div className="mt-8 flex gap-3">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(-1)}
                                className="!h-10"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </div>
                ) : (
                  <div className="text-center py-12">
                    <CarOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
                    <p className="text-gray-400 mt-4">Không có hình ảnh</p>
                  </div>
                )}
              </div>

              <Divider className="my-0" />

              {/* Phần thông tin chính */}
              <div className="bg-white p-8">
                <div className="text-center mb-8">
                  <Title
                    level={1}
                    className="text-3xl font-bold text-gray-800 mb-2"
                  >
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
                  <Title
                    level={2}
                    className="text-4xl font-bold text-blue-600 my-2"
                  >
                    {post.vehicle?.price
                      ? formatPrice(post.vehicle.price)
                      : "Liên hệ"}
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
                          <span className="text-lg font-semibold">
                            Thông tin chi tiết xe
                          </span>
                        </div>
                      }
                      className="shadow-md border-0 rounded-xl"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <Text strong className="text-gray-700">
                            Hãng xe
                          </Text>
                          <Tag color="blue" className="text-sm">
                            {post.vehicle?.brand || "N/A"}
                          </Tag>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <Text strong className="text-gray-700">
                            Mẫu xe
                          </Text>
                          <Text>{post.vehicle?.model || "N/A"}</Text>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <Text strong className="text-gray-700">
                            Năm sản xuất
                          </Text>
                          <Tag color="green" className="text-sm">
                            {post.vehicle?.year || "N/A"}
                          </Tag>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <Text strong className="text-gray-700">
                            Màu sắc
                          </Text>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                              style={{
                                backgroundColor:
                                  post.vehicle?.color?.toLowerCase() ===
                                  "xanh lam"
                                    ? "#1890ff"
                                    : post.vehicle?.color?.toLowerCase() ===
                                      "đỏ"
                                    ? "#ff4d4f"
                                    : post.vehicle?.color?.toLowerCase() ===
                                      "trắng"
                                    ? "#ffffff"
                                    : post.vehicle?.color?.toLowerCase() ===
                                      "đen"
                                    ? "#000000"
                                    : "#d9d9d9",
                              }}
                            />
                            <Text>{post.vehicle?.color || "N/A"}</Text>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <Text strong className="text-gray-700">
                            Loại thân xe
                          </Text>
                          <Text>{post.vehicle?.bodyType || "N/A"}</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  {/* Mô tả bài đăng */}
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <span className="text-lg font-semibold">
                          Mô tả bài đăng
                        </span>
                      }
                      className="shadow-md border-0 rounded-xl h-full"
                    >
                      <Paragraph className="text-gray-700 leading-relaxed text-justify">
                        {post.vehicle?.description &&
                        post.vehicle.description !== "Chưa có mô tả chi tiết."
                          ? post.vehicle.description
                          : "Xe đã qua sử dụng, bảo dưỡng định kỳ đầy đủ. Xe được bảo quản tốt, sạch sẽ, động cơ hoạt động ổn định. Liên hệ trực tiếp để biết thêm thông tin chi tiết và đặt lịch xem xe."}
                      </Paragraph>
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Text className="text-yellow-700 text-sm">
                          💡 <strong>Lưu ý:</strong> Nên kiểm tra xe trực tiếp
                          và đầy đủ giấy tờ trước khi mua.
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
