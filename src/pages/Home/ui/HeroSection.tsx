import React from "react";
import banner from "../../../shared/assets/banner.png";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-sky-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          {/* Badge */}
          <span className="inline-block bg-green-100 text-green-700 font-medium px-4 py-1 rounded-full text-sm shadow-sm">
            Ưu đãi giới hạn
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-800">
            Bán xe xăng, <br />
            <span className="text-green-600">Lên xe điện</span> cùng chúng tôi
          </h1>

          {/* Subtitle */}

          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            Trợ giá lên đến{" "}
            <span className="font-semibold text-green-700">140 triệu đồng</span>{" "}
            cho khách hàng tiên phong chuyển đổi. Số lượng có hạn – đừng bỏ lỡ!
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="bg-green-600  px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition">
              <div className="text-white">Nhận ưu đãi ngay</div>
            </button>
            <button className="bg-white border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-50 transition">
              Tìm hiểu thêm
            </button>
          </div>

          {/* Countdown */}
          <p className="text-red-600 font-medium">
            ⚠️ Chỉ còn <span className="font-bold">3 suất cuối</span>
          </p>
        </div>

        {/* Right image */}
        <div className="flex-1 relative">
          <div className="absolute -top-6 -left-6 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
          <img
            src={banner}
            alt="Xe điện"
            className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};
