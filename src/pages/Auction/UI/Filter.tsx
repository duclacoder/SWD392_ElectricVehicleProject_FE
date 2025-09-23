import React from "react";
import { Car, Search, Calendar, X } from "lucide-react";

type FilterProps = {
    brandFilter: string;
    setBrandFilter: (value: string) => void;
    yearFilter: string;
    setYearFilter: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    resetFilters: () => void;
};

export const Filter: React.FC<FilterProps> = ({
    brandFilter,
    setBrandFilter,
    yearFilter,
    setYearFilter,
    keyword,
    setKeyword,
    resetFilters,
}) => {
    const years = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());

    return (
        <section className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">

                {/* Search */}
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, hãng hoặc model..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Brand */}
                <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 hover:bg-gray-100 transition">
                    <Car className="w-4 h-4 text-gray-400 mr-2" />
                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full"
                    >
                        <option value="">Tất cả hãng</option>
                        {["Toyota", "Honda", "Mercedes"].map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year */}
                <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 hover:bg-gray-100 transition">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full"
                    >
                        <option value="">Tất cả năm</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={resetFilters}
                        className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
                        aria-label="Reset filters"
                    >
                        <X className="w-4 h-4" /> Reset
                    </button>
                    <button
                        className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition"
                        aria-label="Apply filters"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </section>
    );
};
