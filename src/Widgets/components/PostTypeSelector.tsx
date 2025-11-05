import { Card, Divider, Radio } from "antd";
import { Car, Battery, Plus } from "lucide-react";
import React from "react";

interface PostTypeSelectorProps {
  onSelect: (type: "vehicle" | "battery") => void;
}

const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Chọn loại sản phẩm bạn muốn đăng bán
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Lựa chọn Đăng Xe */}
        <Card
          hoverable
          onClick={() => onSelect("vehicle")}
          className="rounded-xl border-2 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="text-center p-4">
            <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="font-semibold text-lg text-gray-900">
              Đăng bán Xe Điện
            </div>
            <p className="text-sm text-gray-500">
              Xe máy điện, ô tô điện...
            </p>
          </div>
        </Card>

        {/* Lựa chọn Đăng Pin */}
        <Card
          hoverable
          onClick={() => onSelect("battery")}
          className="rounded-xl border-2 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="text-center p-4">
            <Battery className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="font-semibold text-lg text-gray-900">
              Đăng bán Pin/Ắc quy
            </div>
            <p className="text-sm text-gray-500">
              Pin xe máy, ô tô, pin lưu trữ...
            </p>
          </div>
        </Card>
      </div>
      <Divider className="my-6" />
      <div className="text-sm text-gray-500 text-center">
        Lưu ý: Bạn cần có gói đăng bài hợp lệ để hoàn tất quá trình.
      </div>
    </div>
  );
};

export default PostTypeSelector;