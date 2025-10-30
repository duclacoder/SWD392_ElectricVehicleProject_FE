import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import {
    Check,
    Star,
    TrendingUp,
    Shield,
    Sparkles,
    Rocket,
} from "lucide-react";
import { adminPostPackageApi } from "../../features/Admin/api/adminPostPackageApi";
import type { PostPackageCustom } from "../../entities/PostPackage";
import { Header } from "../../Widgets/Headers/Header";
import { Footer } from "../../Widgets/Footers/Footer";
import type { CreatePaymentRequest } from "../../entities/Payment";
import { CreatePayment, VnPayPayment } from "../../features/Payment";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api/axios";
import { createUserPackage } from "../../features/Package";
import type { UserPackagesDTO } from "../../entities/UserPackage";


const PackagePricingPage = () => {
    const [packages, setPackages] = useState<PostPackageCustom[]>([]);
    const [isAnnual, setIsAnnual] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const result = await adminPostPackageApi.getAll({
                    page: 1,
                    pageSize: 10,
                });
                if (result?.items?.length) {
                    setPackages(result.items);
                } else {
                    message.warning("Không có gói bài đăng nào được tìm thấy!");
                }
            } catch (error) {
                console.error(error);
                message.error("Không thể tải danh sách gói bài đăng!");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleBuyPackage = async (pkg: PostPackageCustom) => {
        try {
            sessionStorage.setItem("selectedPackage", JSON.stringify(pkg));
            const userId = localStorage.getItem("userId");

            const newUserPackage : UserPackagesDTO = {
                userId: userId ? parseInt(userId) : 0,
                packagesName: pkg.packageName,
                purchasedDuration: pkg.postDuration,
                purchasedAtPrice: isAnnual ? pkg.postPrice * 12 * 0.7 : pkg.postPrice,
                currency: "VND" 
            }

            const userPackage = await createUserPackage(newUserPackage);
            
            const paymentRequestData : CreatePaymentRequest = {
                UserId: userId || "",
                UserPackageId: userPackage?.userPackagesId?.toString() || "",
            }
            const result : boolean = await CreatePayment(paymentRequestData);
            if (result) {
                const vnpayUrl = await VnPayPayment(sessionStorage.getItem("paymentId") || "")
                if (vnpayUrl) 
                    window.open(vnpayUrl);
            }            
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi mua gói!");
        }
    };

    const benefits = [
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Tăng khả năng bán",
            description: "Tiếp cận hàng ngàn người mua tiềm năng mỗi ngày.",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "An toàn bảo mật",
            description: "Giao dịch của bạn được bảo vệ tuyệt đối.",
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Đăng bài nhanh chóng",
            description: "Tạo và đăng bài trong chưa đầy 2 phút.",
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Uy tín đảm bảo",
            description: "Tất cả bài đăng được kiểm duyệt nghiêm ngặt.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-sky-50">
            <Header />
            <main className="flex-grow">
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white">
                    <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            Chọn Gói Đăng Bài <br />
                            <span className="text-sky-200">Phù Hợp Với Bạn</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                            Tăng tốc độ bán xe của bạn với các gói đăng bài được tối ưu hoá.
                        </p>

                        <div className="flex items-center justify-center gap-4 mb-12">
                            <span className={`font-medium ${!isAnnual ? "text-white" : "text-blue-200"}`}>
                                Tháng
                            </span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="relative w-16 h-8 bg-white/30 rounded-full transition-colors"
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? "translate-x-8" : ""
                                        }`}
                                ></div>
                            </button>
                            <span className={`font-medium ${isAnnual ? "text-white" : "text-blue-200"}`}>
                                Năm
                                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-bold">
                                    Tiết kiệm 30%
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {packages.map((pkg) => {
                                const monthlyPrice = pkg.postPrice || 0;
                                const finalPrice = isAnnual ? monthlyPrice * 12 * 0.7 : monthlyPrice;

                                const features = [
                                    `${pkg.postDuration} ngày đăng bài`,
                                    "Được kiểm duyệt nhanh chóng",
                                    "Hỗ trợ hiển thị nổi bật",
                                    "Thống kê lượt xem bài viết",
                                ];

                                return (
                                    <div
                                        key={pkg.postPackageId}
                                        className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                                    >
                                        <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-8 text-white">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Sparkles className="w-8 h-8" />
                                                <h3 className="text-2xl font-bold">{pkg.packageName}</h3>
                                            </div>
                                            <p className="text-blue-100 mb-6">{pkg.description}</p>

                                            <div className="mb-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-bold">
                                                        {(finalPrice / 1000).toFixed(0)}K
                                                    </span>
                                                    <span className="text-blue-100">/ tháng</span>
                                                </div>
                                                {isAnnual && (
                                                    <div className="mt-2 text-sm text-blue-100">
                                                        Thanh toán {(finalPrice / 1000).toFixed(0)}K/năm
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <ul className="space-y-4 mb-8">
                                                {features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handleBuyPackage(pkg)}
                                                className={`w-full py-3 rounded-lg font-semibold transition-all bg-green-100 text-green-700
                                                    `}
                                            >
                                                 Mua gói
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl text-blue-600 mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-gray-600">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PackagePricingPage;
