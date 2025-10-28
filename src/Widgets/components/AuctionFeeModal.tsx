import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Shield, Crown, AlertCircle, Loader2 } from 'lucide-react';
import { getAllAuctionsFees } from '../../features/Admin/api/adminAuctionsFeeApi';
import type { AuctionsFee } from '../../entities/AuctionsFee';

interface AuctionFeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: (fee: AuctionsFee) => void;
    auctionId: number;
}

const AuctionFeeModal: React.FC<AuctionFeeModalProps> = ({
    isOpen,
    onClose,
    onPaymentSuccess,
    auctionId
}) => {
    const [fees, setFees] = useState<AuctionsFee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFee, setSelectedFee] = useState<AuctionsFee | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) fetchAuctionFees();
    }, [isOpen]);

    const fetchAuctionFees = async () => {
        try {
            setLoading(true);
            const result = await getAllAuctionsFees(1, 100); // ✅ Gọi API
            if (result && result.items) setFees(result.items);
            else setFees([]);
        } catch (error) {
            console.error('Error fetching fees:', error);
            setFees([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAndPay = async () => {
        if (!selectedFee) return;
        setProcessing(true);
        try {
            // TODO: Gọi API thanh toán phí thật
            await new Promise(resolve => setTimeout(resolve, 1500));
            onPaymentSuccess(selectedFee);
            onClose();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Thanh toán thất bại. Vui lòng thử lại!');
        } finally {
            setProcessing(false);
        }
    };

    const formatPrice = (price?: number) =>
        price != null ? new Intl.NumberFormat('vi-VN').format(price) : '—';

    const getIconComponent = (index: number) => {
        const icons = [Zap, Shield, Crown];
        const colors = ['text-blue-500', 'text-purple-500', 'text-amber-500'];
        const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-amber-50'];
        const Icon = icons[index % icons.length];
        return { Icon, color: colors[index % colors.length], bgColor: bgColors[index % bgColors.length] };
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white px-8 py-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90 duration-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Thanh toán phí tham gia</h2>
                            <p className="text-blue-100 text-sm">
                                Để tham gia đấu giá, bạn cần thanh toán một trong các gói phí dưới đây
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500">Đang tải gói phí...</p>
                        </div>
                    ) : fees.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">Không có gói phí nào khả dụng</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fees.map((fee, index) => {
                                const { Icon, color, bgColor } = getIconComponent(index);
                                const isSelected = selectedFee?.auctionsFeeId === fee.auctionsFeeId;
                                const isPopular = index === 1;
                                return (
                                    <div
                                        key={fee.auctionsFeeId}
                                        onClick={() => setSelectedFee(fee)}
                                        className={`relative rounded-2xl border-2 transition-all cursor-pointer ${isSelected
                                                ? 'border-blue-500 shadow-xl shadow-blue-100 scale-105'
                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                PHỔ BIẾN NHẤT
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center mb-4`}>
                                                <Icon className={`w-8 h-8 ${color}`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {fee.description || `Gói ${index + 1}`}
                                            </h3>

                                            {/* ✅ Entry Fee hiển thị tại đây */}
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {formatPrice(fee.entryFee)}
                                                </span>
                                                <span className="text-gray-500 ml-1">
                                                    {fee.currency || 'VNĐ'}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {fee.type || '—'}
                                            </p>

                                            <div className="space-y-2 mb-6">
                                                {['Tham gia đấu giá', 'Hoàn tiền nếu không thắng', 'Hỗ trợ 24/7'].map((txt, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-green-600" />
                                                        </div>
                                                        <span>{txt}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                className={`w-full py-3 rounded-xl font-semibold transition-all ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {isSelected ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Check className="w-5 h-5" /> Đã chọn
                                                    </span>
                                                ) : (
                                                    'Chọn gói này'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            {selectedFee ? (
                                <>
                                    Bạn đã chọn:{' '}
                                    <span className="font-semibold text-gray-900">
                                        {selectedFee.description}
                                    </span>{' '}
                                    -{' '}
                                    <span className="font-semibold text-blue-600">
                                        {formatPrice(selectedFee.entryFee)} {selectedFee.currency || 'VNĐ'}
                                    </span>
                                </>
                            ) : (
                                'Vui lòng chọn một gói phí để tiếp tục'
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSelectAndPay}
                                disabled={!selectedFee || processing}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                                    </>
                                ) : (
                                    'Thanh toán ngay'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionFeeModal;
