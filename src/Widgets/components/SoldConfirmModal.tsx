import { CheckCircle } from "lucide-react";
import React from "react";
import type { UserPostCustom } from "../../entities/UserPost";

interface SoldConfirmModalProps {
  visible: boolean;
  post: UserPostCustom | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const SoldConfirmModal: React.FC<SoldConfirmModalProps> = ({
  visible,
  post,
  onCancel,
  onConfirm,
}) => {
  if (!visible || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-center mb-3">
          Xác nhận đã bán xe?
        </h3>
        <p className="text-gray-600 text-center mb-2">
          Bạn có chắc chắn đã bán chiếc xe:
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="font-semibold text-gray-900 mb-1">{post.title}</p>
          {post.vehicle && (
            <p className="text-sm text-gray-600">
              {post.vehicle.brand} {post.vehicle.model} - {post.vehicle.year}
            </p>
          )}
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ Sau khi xác nhận, bài viết sẽ được đánh dấu là "Đã bán" và không
            còn hiển thị trên trang chủ.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoldConfirmModal;
