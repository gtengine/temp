import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
/*********************************************************************************** */
import { USBDeviceInfo } from "@qsoc/js-api/dist/types/device";
import ModalContainer from "./modal-container";

export default function DeviceListModal({
  onClose,
  setDevice,
  deviceList,
}: {
  onClose: () => void;
  setDevice: Dispatch<SetStateAction<USBDeviceInfo>>;
  deviceList: USBDeviceInfo[] | null;
}) {
  /**
   * 장치 선택 버튼 클릭 핸들러
   * @param device 성능 시험 USB 장치
   */
  const onClickSelectButton = (device: USBDeviceInfo) => {
    setDevice(device);
    onClose();
  };
  return (
    <ModalContainer>
      <div className="bg-white min-w-[918px] min-h-[641px] w-95% h-95% p-4 rounded-lg flex flex-col">
        <header className="flex justify-between items-center">
          <h2 className="font-bold text-center">현재 연결된 USB 장치 목록</h2>
          <XMarkIcon
            onClick={onClose}
            className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-900"
          />
        </header>

        <div className="py-3">성능 시험을 수행할 장치를 선택해 주세요.</div>

        {/* 장리 리스트 테이블 */}
        {deviceList?.length ? (
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    productName
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    manufacturerName
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    serialNumber
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    vendorId
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    productId
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {deviceList.map((device: USBDeviceInfo, index: number) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-3">
                      {device.productName}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 text-sm text-gray-500">
                      {device.manufacturerName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {device.serialNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {device.vendorId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {device.productId}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <button
                        onClick={() => onClickSelectButton(device)}
                        className="btn--theme py-1"
                      >
                        선택
                        <span className="sr-only">, {device.serialNumber}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-gray-500">
            <ExclamationTriangleIcon className="w-20 h-20" />
            <p className="text-lg mt-4 pb-20">표시할 장치가 없습니다.</p>
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
