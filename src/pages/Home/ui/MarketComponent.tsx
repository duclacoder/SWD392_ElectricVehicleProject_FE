import React from "react";

const Marketing = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-green-50 to-white">
            <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Sẵn sàng chuyển đổi sang xe điện?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Hãy là người tiên phong trong hành trình xanh – nhận ưu đãi hỗ trợ lên đến{" "}
                    <span className="text-green-600 font-semibold">140 triệu đồng</span>.
                    Số lượng có hạn, đừng bỏ lỡ cơ hội này!
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition">
                        Đăng ký ngay
                    </button>
                    <button className="bg-white border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-50 transition">
                        Tìm hiểu thêm
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Marketing;
