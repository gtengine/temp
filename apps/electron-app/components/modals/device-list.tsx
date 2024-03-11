import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export default function DeviceListModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center select-none z-20">
      <div className="bg-white min-w-[918px] min-h-[641px] w-95% h-95% p-4 rounded-lg flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-center">현재 연결된 USB 장치 목록</h2>
          <XMarkIcon
            onClick={onClose}
            className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
