import { useState } from "react";
/*********************************************************************************** */
import { USBDeviceInfo } from "@qsoc/js-api/dist/types/device";

export function useDevice() {
  // 장치 정보
  const [device, setDevice] = useState<USBDeviceInfo>({
    productName: "",
    manufacturerName: "",
    serialNumber: "",
    vendorId: "",
    productId: "",
  });
  // 장치 리스트
  const [deviceList, setDeviceList] = useState<USBDeviceInfo[] | null>(null);

  return {
    device,
    setDevice,
    deviceList,
    setDeviceList,
  };
}
