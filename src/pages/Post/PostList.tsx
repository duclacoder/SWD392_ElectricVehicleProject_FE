// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Card, Pagination, Spin } from "antd";

// // const PostList: React.FC = () => {
// //     const [posts, setPosts] = useState<any[]>([]);
// //     const [loading, setLoading] = useState(false);
// //     const [page, setPage] = useState(1);
// //     const [total, setTotal] = useState(0);

// //     const pageSize = 10;

// //     useEffect(() => {
// //         const fetchPosts = async () => {
// //             try {
// //                 setLoading(true);
// //                 const res = await axios.get(`https://localhost:7000/api/UserPost`, {
// //                     params: { Page: page, PageSize: pageSize },
// //                 });
// //                 // ✅ Backend nên trả về { data: [...], total: 100 }
// //                 setPosts(res.data.data || res.data);
// //                 setTotal(res.data.total || 0);
// //             } catch (error) {
// //                 console.error("Lỗi khi tải danh sách bài viết:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //         fetchPosts();
// //     }, [page]);

// //     if (loading) return <Spin tip="Đang tải bài viết..." />;

// //     return (
// //         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {posts.map((post) => (
// //                 <Card key={post.id} title={post.title} hoverable>
// //                     <p>{post.description}</p>
// //                 </Card>
// //             ))}

// //             <div className="col-span-full flex justify-center mt-4">
// //                 <Pagination
// //                     current={page}
// //                     total={total}
// //                     pageSize={pageSize}
// //                     onChange={(p) => setPage(p)}
// //                 />
// //             </div>
// //         </div>
// //     );
// // };

// // export default PostList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Pagination, Spin } from "antd";

// const PostList: React.FC = () => {
//     const [posts, setPosts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [total, setTotal] = useState(0);

//     const pageSize = 10;

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get("https://localhost:7000/api/UserPost", {
//                     params: { Page: page, PageSize: pageSize },
//                 });

//                 console.log("API Response:", res.data);

//                 // ✅ Lấy đúng dữ liệu từ cấu trúc API
//                 const items = res.data?.result?.items || [];
//                 const totalItems = res.data?.result?.totalItems || 0;

//                 setPosts(items);
//                 setTotal(totalItems);
//             } catch (error) {
//                 console.error("Lỗi khi tải danh sách bài viết:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPosts();
//     }, [page]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <Spin tip="Đang tải bài viết..." />
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {posts.map((post, index) => (
//                     <Card
//                         key={index}
//                         title={post.title}
//                         hoverable
//                         cover={
//                             post.images && post.images.length > 0 ? (
//                                 <img
//                                     alt="Post"
//                                     src={post.images[0]}
//                                     className="h-48 w-full object-cover"
//                                 />
//                             ) : null
//                         }
//                     >
//                         <p>{post.description}</p>
//                         {post.vehicle && (
//                             <div className="mt-2 text-sm text-gray-600">
//                                 <p>
//                                     <b>Hãng:</b> {post.vehicle.brand}
//                                 </p>
//                                 <p>
//                                     <b>Model:</b> {post.vehicle.model}
//                                 </p>
//                                 <p>
//                                     <b>Giá:</b> {post.vehicle.price.toLocaleString()} USD
//                                 </p>
//                             </div>
//                         )}
//                     </Card>
//                 ))}
//             </div>

//             <div className="col-span-full flex justify-center mt-6">
//                 <Pagination
//                     current={page}
//                     total={total}
//                     pageSize={pageSize}
//                     onChange={(p) => setPage(p)}
//                     showSizeChanger={false}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PostList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Pagination, Spin, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";

const { Title, Text } = Typography;

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 9;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://localhost:7000/api/UserPost", {
                    params: { Page: page, PageSize: pageSize },
                });

                const items = res.data?.result?.items || [];
                const totalItems = res.data?.result?.totalItems || 0;
                setPosts(items);
                setTotal(totalItems);
            } catch (err) {
                console.error(err);
                message.error("Không thể tải danh sách bài viết!");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" tip="Đang tải bài viết..." />
            </div>
        );
    }

    return (
        <div className="px-6 py-8 max-w-[1300px] mx-auto">
            <Header />
            <Title level={2} className="text-center mb-8">
                Tất Cả Bài Đăng Bán Xe
            </Title>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    Hiện chưa có bài đăng nào.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Card
                            key={post.userPostId}
                            hoverable
                            onClick={() => navigate(`/posts/${post.userPostId}`)}
                            className="shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                            cover={
                                post.images && post.images.length > 0 ? (
                                    <img
                                        src={post.images[0]}
                                        alt={post.title}
                                        className="h-56 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-56 flex items-center justify-center bg-gray-100 text-gray-500">
                                        Không có ảnh
                                    </div>
                                )
                            }
                        >
                            <div className="p-2">
                                <Title level={4} ellipsis={{ rows: 1 }}>
                                    {post.title || "Bài đăng chưa có tiêu đề"}
                                </Title>

                                {post.vehicle && (
                                    <>
                                        <Text strong>
                                            {post.vehicle.brand} {post.vehicle.model}
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            Năm: {post.vehicle.year} • Màu: {post.vehicle.color}
                                        </Text>
                                        <br />
                                        <Text type="danger" strong className="text-lg">
                                            {post.vehicle.price.toLocaleString()} VNĐ
                                        </Text>
                                    </>
                                )}
                                <br />
                                <Text type="secondary" className="text-sm">
                                    Người đăng: {post.userName || "Ẩn danh"}
                                </Text>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-10">
                <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={(p) => setPage(p)}
                    showSizeChanger={false}
                />
            </div>
            <Footer />
        </div>
    );
};

export default PostList;
