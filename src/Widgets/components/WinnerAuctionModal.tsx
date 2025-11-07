import React, { useEffect, useState } from "react";
import { auctionApi } from "../../features/Auction";
import type { AuctionWinnerDTO } from "../../entities/AuctionWinnerDto";

interface WinnerModalProps {
  auctionId: number;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ auctionId, isOpen, onClose }) => {
  const [winner, setWinner] = useState<AuctionWinnerDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadWinner();
  }, [isOpen]);

  const loadWinner = async () => {
    setLoading(true);
    const data = await auctionApi.getAuctionWinner(auctionId);
    setWinner(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Người thắng đấu giá</h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : winner ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Họ tên:</span> {winner.fullName}</p>
            <p><span className="font-semibold">Email:</span> {winner.email}</p>
            <p><span className="font-semibold">Số điện thoại:</span> {winner.phone}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có người thắng.</p>
        )}
      </div>
    </div>
  );
};

export default WinnerModal;
