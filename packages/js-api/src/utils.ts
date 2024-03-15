import * as usb from "usb";
import { printUint8ToHex } from "./fw-info";
import { apiList } from "./constants/api-list";

export function startMessage(apiName: string) {
  switch (apiName) {
    case apiList.loopback:
      console.log("Loop Back");
      break;
    case apiList.getFWInfo:
      console.log("Get firmware info");
      break;
    case apiList.setSerialNumber:
      console.log("Set serial-number");
      break;
    case apiList.SWReset:
      console.log("Reset software");
      break;
  }
}

/**
 * 통신에 대한 Mbps 성능 측정
 * @param startTime trans out 직전 시간
 * @param endTime trans in 직후 시간
 * @param dataSize 통신 데이터 크기
 */
export function calculateMbps(
  startTime: number,
  endTime: number,
  dataSize: number
): number {
  const time = (endTime - startTime) / 1000;
  const size = dataSize * 8;
  const mBps = (size / time / 1000000).toFixed(2);
  console.log();
  console.log(`**************************************** ${mBps} Mbps`);
  console.log();
  return Number(mBps);
}

/**
 * 주입 데이터와 반환 데이터를 출력
 * @param outData trans out data
 * @param inData trans in data
 * @param dataSize 통신 data 크기
 */
export function printResult(
  outData: Uint8Array,
  inData: Uint8Array,
  dataSize: number
): void {
  console.log(`Trans Out Data - data length: ${dataSize}`);
  printUint8ToHex(outData);
  console.log();
  console.log(`Trans In Data - data length: ${dataSize}`);
  printUint8ToHex(inData);
}

/**
 * 장치가 열려있는지 확인하고, 열려있는 장치는 닫는 함수
 * @param device WebUSBDevice
 */
export async function closeDevice(device: usb.WebUSBDevice) {
  if (device && device.opened) {
    await device.close();
    console.log("Device closed.");
    console.log("##################################");
    console.log();
  }
}

/**
 * 두 배열이 같은지 다른지 비교하는 함수
 * @param array1 비교할 배열
 * @param array2 비교할 배열
 * @returns 참, 거짓
 */
export function areArraysEqual(
  array1: Uint8Array,
  array2: Uint8Array
): boolean {
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }

  return true;
}
