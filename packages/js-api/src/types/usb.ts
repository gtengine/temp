/**
 * 반환받을 descriptor 속성 정의
 */
export interface UsbDeviceInfo {
  vendorId: number;
  productId: number;
  serialNumber: string | null;
  manufacturer: string | null;
  product: string | null;
}
