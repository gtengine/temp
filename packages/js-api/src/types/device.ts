/**
 * 반환받을 descriptor 속성 정의
 */
export interface USBDeviceInfo {
  productName: string;
  manufacturerName: string;
  serialNumber: string;
  vendorId: number | string;
  productId: number | string;
}
