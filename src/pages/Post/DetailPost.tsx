import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckOutlined,
  EyeOutlined,
  HeartOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Image,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserPostCustom } from "../../entities/UserPost";
import { getUserPostById } from "../../features/Post";
import { getUserById } from "../../features/Post/UserPost";
import { Footer } from "../../Widgets/Footers/Footer";
import { Header } from "../../Widgets/Headers/Header";
import { motion } from "framer-motion";
import { HeartFilled } from "@ant-design/icons";
import type { User } from "../../entities/User";


const { Title, Text, Paragraph } = Typography;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<UserPostCustom | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href; // lấy URL hiện tại
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      message.success("Đã sao chép liên kết chia sẻ!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Lỗi khi sao chép link:", err);
      message.error("Không thể sao chép liên kết.");
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const data = await getUserPostById(Number(id));
      if (data) {
        setPost(data);
        if (data.userId) {
          const user = await getUserById(String(data.userId));
          if (user) {
            setUserInfo(user);
          }
        }
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDetailPost = (price: number): string => {
    if (price === undefined || price === null || isNaN(price) || price === 0) {
      return "0";
    }
    if (price >= 1_000_000_000_000) {
      return (price / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + " nghìn tỷ";
    } else if (price >= 1_000_000_000) {
      return (price / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    } else if (price >= 1_000_000) {
      return (price / 1_000_000).toFixed(1).replace(/\.0$/, "") + " triệu";
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1).replace(/\.0$/, "") + " nghìn";
    } else {
      return price.toString();
    }
  };


  const getPostPrice = (post: UserPostCustom | null): number | undefined => {
    if (!post) return undefined;
    return post.vehicle?.price ?? post.battery?.price;
  };

  const price = getPostPrice(post);

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
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate(-1)}
              >
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
                                objectFit: "cover",
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
                                    cursor: "pointer",
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
                      <CarOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
                      <p className="text-gray-400 mt-4">Không có hình ảnh</p>
                    </div>
                  )}
                </Card>

                {/* Thông tin xe cơ bản */}
                <Card
                  title={
                    <span className="text-lg font-semibold">
                      Thông tin xe cơ bản
                    </span>
                  }
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
                          <div className="text-gray-500 text-sm">
                            Năm sản xuất
                          </div>
                          <div className="font-semibold">
                            {post.vehicle?.year || "N/A"}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="flex items-start gap-3">
                        <CarOutlined className="text-blue-500 text-xl mt-1" />
                        <div>
                          <div className="text-gray-500 text-sm">Hãng xe</div>
                          <div className="font-semibold">
                            {post.vehicle?.brand || "N/A"}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="flex items-start gap-3">
                        <CarOutlined className="text-blue-500 text-xl mt-1" />
                        <div>
                          <div className="text-gray-500 text-sm">Mẫu xe</div>
                          <div className="font-semibold">
                            {post.vehicle?.model || "N/A"}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="flex items-start gap-3">
                        <CarOutlined className="text-blue-500 text-xl mt-1" />
                        <div>
                          <div className="text-gray-500 text-sm">Kiểu dáng</div>
                          <div className="font-semibold">
                            {post.vehicle?.bodyType || "Sedan"}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full mt-1 border-2 border-gray-300"
                          style={{
                            backgroundColor:
                              post.vehicle?.color?.toLowerCase() === "xanh lam"
                                ? "#1890ff"
                                : post.vehicle?.color?.toLowerCase() === "đỏ"
                                  ? "#ff4d4f"
                                  : post.vehicle?.color?.toLowerCase() === "trắng"
                                    ? "#ffffff"
                                    : post.vehicle?.color?.toLowerCase() === "đen"
                                      ? "#000000"
                                      : "#d9d9d9",
                          }}
                        />
                        <div>
                          <div className="text-gray-500 text-sm">Màu sắc</div>
                          <div className="font-semibold">
                            {post.vehicle?.color || "N/A"}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Mô tả chi tiết */}
                <Card
                  title={
                    <span className="text-lg font-semibold">
                      Mô tả chi tiết
                    </span>
                  }
                  className="!rounded-xl shadow-md"
                >


                  <div
                    className="text-gray-800 leading-relaxed text-justify prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        post.vehicle?.description &&
                          post.vehicle.description !== "Chưa có mô tả chi tiết."
                          ? post.vehicle.description
                          : `<p>Xe đã qua sử dụng, bảo dưỡng định kỳ đầy đủ. Xe được bảo quản tốt, sạch sẽ, động cơ hoạt động ổn định. Liên hệ trực tiếp để biết thêm thông tin chi tiết và đặt lịch xem xe.</p>`,
                    }}
                  />


                  <Divider />

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <Text className="text-yellow-800">
                      💡 <strong>Lưu ý:</strong> Nên kiểm tra xe trực tiếp và
                      đầy đủ giấy tờ trước khi mua.
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
                      {price ? formatDetailPost(price) : "Liên hệ"}
                    </div>
                    {post.vehicle?.price && (
                      <div className="text-sm text-gray-500">
                        {formatPrice(post.vehicle.price)}
                      </div>
                    )}
                  </div>
                  {userInfo?.phone ? (
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<PhoneOutlined />}
                      className="!h-12 !rounded-xl !text-base font-semibold mb-3"
                      href={`tel:${userInfo.phone}`}
                    >
                      {userInfo.phone}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="!h-12 !rounded-xl !text-base font-semibold mb-3"
                    >
                      📞 Liên hệ ngay
                    </Button>
                  )}

                  <Row gutter={8}>
                    <Col span={12}>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="relative"
                      >
                        <Button
                          block
                          icon={liked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                          className="!h-10 !rounded-lg"
                          onClick={() => setLiked(!liked)}
                        >
                          {liked ? "Đã yêu thích" : "Yêu thích"}
                        </Button>

                        {/* Hiệu ứng tim bay lên */}
                        {liked && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.5 }}
                            animate={{ opacity: 1, y: -40, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute left-1/2 -translate-x-1/2 text-pink-500 text-2xl select-none"
                          >
                            ❤️
                          </motion.div>
                        )}
                      </motion.div>
                    </Col>

                    {/* <Col span={12}>
                      <Button
                        block
                        icon={<ShareAltOutlined />}
                        className="!h-10 !rounded-lg"
                      >
                        Chia sẻ
                      </Button>
                    </Col> */}

                    <Col span={12}>
                      <Button
                        block
                        icon={copied ? <CheckOutlined /> : <ShareAltOutlined />}
                        className="!h-10 !rounded-lg"
                        onClick={handleShare}
                      >
                        {copied ? "Đã sao chép" : "Chia sẻ"}
                      </Button>
                    </Col>

                  </Row>

                  <Divider />

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {userInfo?.imageUrl ? (
                        <img
                          src={userInfo.imageUrl}
                          alt={userInfo.fullName || post.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserOutlined className="text-blue-600 text-xl" />
                      )}{" "}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {userInfo?.fullName || "Người bán"}
                        <div className="text-sm text-gray-500">Người bán</div>
                      </div>
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
                    {userInfo?.fullName && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          <UserOutlined className="mr-2" />
                          Người bán
                        </span>
                        <span className="font-medium">
                          {userInfo?.fullName || "Người bán"}
                        </span>
                      </div>
                    )}

                    {userInfo?.phone && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          <PhoneOutlined className="mr-2" />
                          Điện thoại
                        </span>
                        <a
                          href={`tel:${userInfo.phone}`}
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {userInfo.phone}
                        </a>
                      </div>
                    )}

                    {userInfo?.email && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          <MailOutlined className="mr-2" />
                          Email
                        </span>
                        <a
                          href={`mailto:${userInfo.email}`}
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline truncate max-w-[150px]"
                          title={userInfo.email}
                        >
                          {userInfo.email}
                        </a>
                      </div>
                    )}
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
