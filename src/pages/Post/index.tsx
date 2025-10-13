// import React, { useState } from "react";
// import {
//     Form,
//     Input,
//     Button,
//     InputNumber,
//     Select,
//     Card,
//     Typography,
//     Row,
//     Col,
//     Upload,
//     message,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import type { CreateUserPostDTO } from "../../entities/UserPost";
// import { createUserPost } from "../../features/Post";
// import { useNavigate } from "react-router-dom";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const PostVehicleSale: React.FC = () => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     // Cấu hình upload ảnh (mock API)
//     const uploadProps = {
//         name: "file",
//         action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
//         headers: { authorization: "authorization-text" },
//         multiple: true,
//         onChange(info: any) {
//             if (info.file.status === "done") {
//                 message.success(`${info.file.name} tải lên thành công`);
//             } else if (info.file.status === "error") {
//                 message.error(`${info.file.name} tải lên thất bại`);
//             }
//         },
//     };

//     const onFinish = async (values: any) => {
//         setLoading(true);
//         try {
//             const postData: CreateUserPostDTO = {
//                 userName: "Admin",
//                 title: values.title,
//                 year: values.vehicleYear,
//                 packageName: values.packageName || "a",
//                 imageUrls: [], // có thể thay bằng URL thực tế từ uploadProps
//                 vehicle: {
//                     brand: values.vehicleBrand,
//                     model: values.vehicleModel,
//                     year: values.vehicleYear,
//                     color: values.vehicleColor,
//                     price: values.vehiclePrice,
//                     description: values.vehicleDescription,
//                     bodyType: values.vehicleBodyType,
//                     rangeKm: values.vehicleRangeKm,
//                     motorPowerKw: values.vehicleMotorPowerKw,
//                 },
//             };

//             const result = await createUserPost(postData);
//             if (result) {
//                 message.success("Bài đăng bán xe đã được tạo thành công!");
//                 form.resetFields();
//             }
//         } catch (error) {
//             console.error("Failed to create user post:", error);
//             message.error("Đã xảy ra lỗi khi đăng bài bán xe.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
//             <Card>
//                 <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
//                     Đăng Bài Bán Xe
//                 </Title>
//                 <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
//                     <Title level={4}>Thông tin bài đăng</Title>
//                     <Form.Item
//                         name="title"
//                         label="Tiêu đề bài đăng"
//                         rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài đăng!" }]}
//                     >
//                         <Input placeholder="Ví dụ: Bán Tesla Model 3 2022 chính chủ" />
//                     </Form.Item>

//                     <Title level={4} style={{ marginTop: "30px" }}>
//                         Thông tin xe
//                     </Title>

//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="vehicleBrand"
//                                 label="Hãng xe"
//                                 rules={[{ required: true, message: "Nhập hãng xe!" }]}
//                             >
//                                 <Input placeholder="Ví dụ: Tesla, Toyota, VinFast" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item
//                                 name="vehicleModel"
//                                 label="Mẫu xe"
//                                 rules={[{ required: true, message: "Nhập mẫu xe!" }]}
//                             >
//                                 <Input placeholder="Ví dụ: Model 3, Camry, VF8" />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehicleYear"
//                                 label="Năm sản xuất"
//                                 rules={[{ required: true, message: "Nhập năm sản xuất!" }]}
//                             >
//                                 <InputNumber
//                                     min={1900}
//                                     max={new Date().getFullYear() + 1}
//                                     style={{ width: "100%" }}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehicleColor"
//                                 label="Màu sắc"
//                                 rules={[{ required: true, message: "Nhập màu xe!" }]}
//                             >
//                                 <Input placeholder="Ví dụ: Trắng, Đen, Đỏ" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehicleBodyType"
//                                 label="Dòng xe"
//                                 rules={[{ required: true, message: "Nhập dòng xe!" }]}
//                             >
//                                 <Input placeholder="Ví dụ: Sedan, SUV, Coupe" />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehicleRangeKm"
//                                 label="Quãng đường (km)"
//                                 rules={[{ required: true, message: "Nhập quãng đường!" }]}
//                             >
//                                 <InputNumber min={0} style={{ width: "100%" }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehicleMotorPowerKw"
//                                 label="Công suất (kW)"
//                                 rules={[{ required: true, message: "Nhập công suất!" }]}
//                             >
//                                 <InputNumber min={0} style={{ width: "100%" }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item
//                                 name="vehiclePrice"
//                                 label="Giá bán (VNĐ)"
//                                 rules={[{ required: true, message: "Nhập giá bán!" }]}
//                             >
//                                 <InputNumber
//                                     min={0}
//                                     style={{ width: "100%" }}
//                                     formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//                                 />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Form.Item
//                         name="vehicleDescription"
//                         label="Mô tả chi tiết"
//                         rules={[{ required: true, message: "Nhập mô tả chi tiết!" }]}
//                     >
//                         <Input.TextArea
//                             rows={5}
//                             placeholder="Tình trạng, trang bị, lý do bán..."
//                         />
//                     </Form.Item>

//                     <Title level={4} style={{ marginTop: "30px" }}>
//                         Hình ảnh xe
//                     </Title>
//                     <Text type="secondary">
//                         Hãy tải lên hình ảnh rõ nét để thu hút người mua.
//                     </Text>
//                     <Form.Item
//                         name="imageUpload"
//                         valuePropName="fileList"
//                         getValueFromEvent={(e) =>
//                             Array.isArray(e) ? e : e && e.fileList
//                         }
//                     >
//                         <Upload {...uploadProps} listType="picture-card">
//                             <div>
//                                 <UploadOutlined />
//                                 <div style={{ marginTop: 8 }}>Tải ảnh</div>
//                             </div>
//                         </Upload>
//                     </Form.Item>

//                     <Form.Item style={{ marginTop: "40px", textAlign: "center" }}>
//                         <Button
//                             type="primary"
//                             htmlType="submit"
//                             size="large"
//                             loading={loading}
//                             block
//                         >
//                             Đăng Bài Ngay
//                         </Button>
//                     </Form.Item>
//                     <Form.Item style={{ marginTop: "10px", textAlign: "center" }}>
//                         <Button
//                             type="default"
//                             size="large"
//                             onClick={() => navigate("/posts")}
//                             block
//                         >
//                             Xem tất cả bài viết
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </div>
//     );
// };

// export default PostVehicleSale;


import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    InputNumber,
    Row,
    Col,
    Upload,
    message,
    Card,
    Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import type { CreateUserPostDTO } from "../../entities/UserPost";
import { createUserPost } from "../../features/Post";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const PostVehicleSale: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Upload cấu hình (mock API)
    const uploadProps = {
        name: "file",
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        headers: { authorization: "authorization-text" },
        multiple: true,
        onChange(info: any) {
            if (info.file.status === "done") {
                message.success(`${info.file.name} tải lên thành công`);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const postData: CreateUserPostDTO = {
                userName: "Admin",
                title: values.title,
                year: values.vehicleYear,
                packageName: values.packageName || "a",
                imageUrls: [],
                vehicle: {
                    brand: values.vehicleBrand,
                    model: values.vehicleModel,
                    year: values.vehicleYear,
                    color: values.vehicleColor,
                    price: values.vehiclePrice,
                    description: values.vehicleDescription,
                    bodyType: values.vehicleBodyType,
                    rangeKm: values.vehicleRangeKm,
                    motorPowerKw: values.vehicleMotorPowerKw,
                },
            };

            const result = await createUserPost(postData);
            if (result) {
                message.success("🎉 Bài đăng bán xe đã được tạo thành công!");
                form.resetFields();
                navigate("/"); // trở về trang chủ
            }
        } catch (error) {
            console.error("Failed to create user post:", error);
            message.error("❌ Đã xảy ra lỗi khi đăng bài bán xe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="bg-gray-50 py-16 min-h-screen">
                <div className="max-w-5xl mx-auto px-6">
                    <Card className="shadow-lg rounded-2xl">
                        <Title
                            level={2}
                            style={{ textAlign: "center", marginBottom: "30px" }}
                        >
                            Đăng Bài Bán Xe
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {/* Thông tin bài đăng */}
                            <Title level={4}>Thông tin bài đăng</Title>
                            <Form.Item
                                name="title"
                                label="Tiêu đề bài đăng"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tiêu đề bài đăng!" },
                                ]}
                            >
                                <Input placeholder="Ví dụ: Bán Tesla Model 3 2022 chính chủ" />
                            </Form.Item>

                            {/* Thông tin xe */}
                            <Title level={4} style={{ marginTop: 30 }}>
                                Thông tin xe
                            </Title>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="vehicleBrand"
                                        label="Hãng xe"
                                        rules={[{ required: true, message: "Nhập hãng xe!" }]}
                                    >
                                        <Input placeholder="Ví dụ: Tesla, Toyota, VinFast" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="vehicleModel"
                                        label="Mẫu xe"
                                        rules={[{ required: true, message: "Nhập mẫu xe!" }]}
                                    >
                                        <Input placeholder="Ví dụ: Model 3, Camry, VF8" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehicleYear"
                                        label="Năm sản xuất"
                                        rules={[{ required: true, message: "Nhập năm sản xuất!" }]}
                                    >
                                        <InputNumber
                                            min={1900}
                                            max={new Date().getFullYear() + 1}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehicleColor"
                                        label="Màu sắc"
                                        rules={[{ required: true, message: "Nhập màu xe!" }]}
                                    >
                                        <Input placeholder="Ví dụ: Trắng, Đen, Đỏ" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehicleBodyType"
                                        label="Dòng xe"
                                        rules={[{ required: true, message: "Nhập dòng xe!" }]}
                                    >
                                        <Input placeholder="Ví dụ: Sedan, SUV, Coupe" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehicleRangeKm"
                                        label="Quãng đường (km)"
                                        rules={[{ required: true, message: "Nhập quãng đường!" }]}
                                    >
                                        <InputNumber min={0} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehicleMotorPowerKw"
                                        label="Công suất (kW)"
                                        rules={[{ required: true, message: "Nhập công suất!" }]}
                                    >
                                        <InputNumber min={0} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="vehiclePrice"
                                        label="Giá bán (VNĐ)"
                                        rules={[{ required: true, message: "Nhập giá bán!" }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            formatter={(v) =>
                                                `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="vehicleDescription"
                                label="Mô tả chi tiết"
                                rules={[{ required: true, message: "Nhập mô tả chi tiết!" }]}
                            >
                                <Input.TextArea
                                    rows={5}
                                    placeholder="Tình trạng, lý do bán, nâng cấp, bảo hành..."
                                />
                            </Form.Item>

                            <Form.Item label="Hình ảnh xe">
                                <Upload {...uploadProps} listType="picture">
                                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                </Upload>
                            </Form.Item>

                            <div className="flex justify-center mt-8">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="bg-green-600 hover:bg-green-700 px-8 py-2 rounded-lg"
                                >
                                    Đăng bài
                                </Button>
                            </div>
                            <div className="flex justify-center mt-8">
                                <Button
                                    type="default"
                                    onClick={() => navigate("/posts")}
                                    className="border-gray-400 px-8 py-2 rounded-lg w-60"
                                >
                                    Xem tất cả bài đăng
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default PostVehicleSale;
