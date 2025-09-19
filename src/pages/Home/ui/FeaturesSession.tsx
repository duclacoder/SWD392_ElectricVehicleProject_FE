import React from "react";
import { Battery, Leaf, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: <Battery className="w-8 h-8 text-green-600" />,
        title: "Tiết kiệm nhiên liệu",
        desc: "Giảm chi phí vận hành đến 70% so với xe xăng truyền thống.",
    },
    {
        icon: <Leaf className="w-8 h-8 text-green-600" />,
        title: "Thân thiện môi trường",
        desc: "Không khí sạch hơn với công nghệ động cơ điện không khí thải.",
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
        title: "An toàn & bền bỉ",
        desc: "Trang bị công nghệ pin an toàn, bảo hành chính hãng dài hạn.",
    },
];

const Features = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                    Vì sao nên chọn xe điện?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center"
                        >
                            {f.icon}
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                {f.title}
                            </h3>
                            <p className="text-gray-600 mt-2">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
