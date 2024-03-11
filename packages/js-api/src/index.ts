import * as usb from "usb";
import {
  DATA_SIZE,
  _CGetFWInfo,
  _CLoopBack,
  _CRandomData,
  _CSWReset,
  _CSetSerialNumber,
} from "./commands";
import { parseTransInData, printCiBuffer } from "./fw-info";
import { UsbDeviceInfo } from "./types/usb";
import { calculateMbps, closeDevice, printResult, startMessage } from "./utils";

/**
 * 연결된 USB 장치들을 리스트로 반환
 * @returns USB 장치 리스트
 */
export function listUsbDevices() {
  return usb.getDeviceList();
}

/**
 * descriptor의 입력된 인덱스에 해당하는 속성에 대한 값을 반환하는 함수
 * @param device USB 장치
 * @param index descriptor 내의 조회할 속성의 인덱스
 * @returns 조회한 속성의 값
 */
async function getStringDescriptor(
  device: usb.Device,
  index: number
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    device.getStringDescriptor(index, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data ?? null);
      }
    });
  });
}

/**
 * 연결되어 있는 USB 장치들 중, 읽기 가능한 장치들의 정보들을 리스트로 반환
 * @returns 제조사 ID, 제품 ID, 시리얼 넘버, 제조사, 제품 이름들의 리스트
 */
export async function getReadableUsbDevices(): Promise<UsbDeviceInfo[]> {
  const devices = usb.getDeviceList();
  const readableDevices: UsbDeviceInfo[] = [];
  let count: number = 0;
  for (const device of devices) {
    try {
      device.open();
      const descriptor = device.deviceDescriptor;

      const manufacturer = await getStringDescriptor(
        device,
        descriptor.iManufacturer
      ).catch(() => null);
      const product = await getStringDescriptor(
        device,
        descriptor.iProduct
      ).catch(() => null);
      const serialNumber = await getStringDescriptor(
        device,
        descriptor.iSerialNumber
      ).catch(() => null);

      readableDevices.push({
        vendorId: descriptor.idVendor,
        productId: descriptor.idProduct,
        serialNumber,
        manufacturer,
        product,
      });
    } catch (error) {
      console.error(`접근하지 못한 USB 장치: ${count}`);
      ++count;
    } finally {
      try {
        device.close();
      } catch (closeError) {
        console.error("USB 장치 종료 에러: ", closeError);
      }
    }
  }
  return readableDevices;
}

/****************************FX3 연동 시험 *******************************/
const VID = 0x0692;
const PID = 0x9912;
let startTime;
let endTime;

/**
 * serialNumber에 해당하는 FX3 보드 반환
 * @returns USB Device
 */
export async function findNsrFx3Board() {
  try {
    const device = await usb.findBySerialNumber("012345678901");
    if (!device) {
      throw new Error("장치를 찾을 수 없습니다.");
    }
    return device;
  } catch (error) {
    // Error 타입으로 타입 단언
    if (error instanceof Error) {
      return error.message;
    } else {
      // 만약 error가 Error 타입이 아닐 경우의 처리
      return "알 수 없는 오류가 발생했습니다.";
    }
  }
}

/**
 * vid, pid로 장치 검색 후, lagacy device를 WebUSB API와 호환 가능한 장치로 전환
 * @param vId vendor id
 * @param pId product id
 * @returns WebUSBDevice
 */
export async function createWebUSBDevice(
  vId: number,
  pId: number
): Promise<usb.WebUSBDevice> {
  const device = usb.findByIds(vId, pId);
  if (!device) {
    throw new Error("장치를 찾을 수 없습니다.");
  }

  const webDevice = await usb.WebUSBDevice.createInstance(device);
  if (!webDevice) {
    throw new Error("WebUSB 장치를 생성할 수 없습니다.");
  }
  return webDevice;
}

/**
 * interface number 및 bulk out, in에 대한 endpoint 설정
 * @param device WebUSB 장치
 * @returns bulkOutEndpoint, bulkInEndpoint
 */
async function setCommunication(device: usb.WebUSBDevice) {
  // 인터페이스 설정
  if (!device.configurations[0]?.interfaces[0]) {
    throw new Error("인터페이스를 찾을 수 없습니다.");
  }
  const interfaceNumber =
    device.configurations[0]?.interfaces[0]?.interfaceNumber;
  await device.selectConfiguration(1);
  await device.claimInterface(interfaceNumber);
  console.log("Interface 점유");

  // 엔드포인트 설정
  const bulkOutEndpoint =
    device.configuration?.interfaces[0]?.alternate.endpoints.find(
      (e) => e.direction === "out" && e.type === "bulk"
    );
  const bulkInEndpoint =
    device.configuration?.interfaces[0]?.alternate.endpoints.find(
      (e) => e.direction === "in" && e.type === "bulk"
    );
  if (!bulkOutEndpoint || !bulkInEndpoint) {
    throw new Error("필요한 엔드포인트를 찾을 수 없습니다.");
  }
  console.log("Endpoint 설정");

  return { bulkOutEndpoint, bulkInEndpoint };
}

/**
 * 명령 번호에 따른 통신 데이터 설정
 * @param commandNumber 1, 2, 3, 4 (FW 명령 번호)
 * @param serialNumber 3일 경우, 지정할 시리얼 넘버
 * @returns
 */
function setData(commandNumber: number, serialNumber?: string) {
  switch (commandNumber) {
    case 1:
      return _CLoopBack();
    case 2:
      return _CGetFWInfo();
    case 3:
      if (!serialNumber) {
        throw new Error("Serial-Number 정보가 없습니다.");
      }
      return _CSetSerialNumber(serialNumber);
    case 4:
      return _CSWReset();
  }
}

/****************************************
 * 지정한 명령에 따른 USB 통신 함수
 * @param commandNumber 1, 2, 3, 4 (FW 명령 번호)
 * @param serialNumber 3일 경우, 지정할 시리얼 넘버
 * @returns
 */
export async function bulkCommunication(
  commandNumber: number,
  serialNumber?: string
) {
  console.log("##################################");
  startMessage(commandNumber);

  const webDevice = await createWebUSBDevice(VID, PID);
  try {
    await webDevice.open();
    console.log("Device opened.");

    const { bulkOutEndpoint, bulkInEndpoint } =
      await setCommunication(webDevice);

    // Bulk out
    let dataOut: Uint8Array = setData(
      commandNumber,
      serialNumber
    ) as Uint8Array;

    startTime = performance.now();
    await webDevice.transferOut(bulkOutEndpoint.endpointNumber, dataOut);

    // Bulk in
    const resultIn = await webDevice.transferIn(
      bulkInEndpoint.endpointNumber,
      DATA_SIZE
    );
    endTime = performance.now();
    if (!resultIn.data) {
      throw new Error("Bulk in 데이터를 수신하지 못했습니다.");
    }
    const dataIn = new Uint8Array(resultIn.data?.buffer);

    const dataLength = commandNumber !== 4 ? DATA_SIZE : 64;
    printResult(dataOut, dataIn, dataLength);

    // getFWInfo, setSerialNumber일 경우에는 ciBuffer 출력
    if (commandNumber === 2 || commandNumber === 3) {
      // Bulk out
      const getFWdataOut = _CGetFWInfo();
      await webDevice.transferOut(bulkOutEndpoint.endpointNumber, getFWdataOut);

      // Bulk in
      const getFWresultIn = await webDevice.transferIn(
        bulkInEndpoint.endpointNumber,
        DATA_SIZE
      );
      console.log(getFWresultIn);
      console.log(typeof getFWresultIn);

      if (!getFWresultIn.data) {
        throw new Error("Bulk in 데이터를 수신하지 못했습니다.");
      }
      const getFWdataIn = new Uint8Array(getFWresultIn.data?.buffer);
      printCiBuffer(getFWdataIn);
    }

    // Mbps 계산 결과 출력
    calculateMbps(startTime, endTime, DATA_SIZE);

    // 결과 반환
    return {
      transferInStatus: resultIn.status,
      transferInData: parseTransInData(dataIn, commandNumber),
    };
  } catch (error) {
    console.error("Error", error);
    throw error;
  } finally {
    await closeDevice(webDevice);
  }
}

export async function measurePerfAverage(bytes: number, num: number) {
  console.log("##################################");
  console.log("Performance Average.");

  if (bytes > 8192) {
    throw new Error("한 번에 전송할 수 있는 데이터는 8k를 초과할 수 없습니다.");
  }

  const webDevice: usb.WebUSBDevice = await createWebUSBDevice(VID, PID);
  try {
    await webDevice.open();
    console.log("Device opened.");

    const { bulkOutEndpoint, bulkInEndpoint } =
      await setCommunication(webDevice);

    let mbpsArr: number[] = [];
    let time: number = 0;
    for (let i = 0; i < num; i++) {
      // Bulk out
      const dataOut = _CRandomData(bytes, true);
      startTime = performance.now();
      await webDevice.transferOut(bulkOutEndpoint.endpointNumber, dataOut);

      // Bulk in
      const resultIn = await webDevice.transferIn(
        bulkInEndpoint.endpointNumber,
        dataOut.length
      );
      endTime = performance.now();
      if (!resultIn.data) {
        throw new Error("Bulk in 데이터를 수신하지 못했습니다.");
      }
      const dataIn = new Uint8Array(resultIn.data?.buffer);

      // printResult(dataOut, dataIn, dataOut.length);
      // if (!areArraysEqual(dataOut.slice(16), dataIn.slice(16)))
      //   throw new Error("데이터 송-수신이 잘못 되었습니다.");
      mbpsArr[i] = calculateMbps(startTime, endTime, dataOut.length);
      time += endTime - startTime;
    }

    console.log("===============");
    let sum = 0;
    let avg = 0;
    let max = 0;
    let min = Infinity; // 초기 최소값은 무한대로 설정
    let std = 0;
    let varianceSum = 0;

    for (let i = 0; i < 100; i++) {
      const value = mbpsArr[i] ?? 0;
      sum += value;
      avg = sum / (i + 1);
      max = Math.max(max, value);
      min = Math.min(min, value);

      if (i === 9 || i === 29 || i === 49 || i === 99) {
        console.log(`${i + 1}회 평균: ${avg.toFixed(2)}`);
      }
    }

    // 표준편차 계산
    for (let i = 0; i < 100; i++) {
      varianceSum += Math.pow((mbpsArr[i] ?? 0) - avg, 2);
    }
    std = Math.sqrt(varianceSum / 100);

    console.log(
      `최대값: ${max.toFixed(2)}, 최소값: ${min.toFixed(
        2
      )}, 표준편차: ${std.toFixed(2)}`
    );
    console.log("통신 시간: ", (time / 1000).toFixed(2));
    console.log("===============");

    // 평균 계산
    const avgPref = mbpsArr.reduce((a, b) => a + b, 0) / mbpsArr.length;
    console.log(
      `******************** ${bytes}bytes - ${num}회 성능 평균: ${avgPref.toFixed(
        2
      )} Mbps`
    );

    // 결과 반환
    return { averagePref: avgPref };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await closeDevice(webDevice);
  }
}

export async function measureChunkPref(bytes: number, chunk: number) {
  console.log("##################################");
  console.log("Chunk Performance");

  if (chunk > 8192) {
    throw new Error("한 번에 전송할 수 있는 데이터는 8k를 초과할 수 없습니다.");
  }

  // 장치 생성
  const webDevice: usb.WebUSBDevice = await createWebUSBDevice(VID, PID);
  try {
    await webDevice.open();
    console.log("Device opened.");

    // 인터페이스 점유, 엔드포인트 설정
    const { bulkOutEndpoint, bulkInEndpoint } =
      await setCommunication(webDevice);

    let mbpsArr: number[] = [];
    let dataSize = bytes;
    let restData: number = bytes % chunk;
    let time = 0;
    while (dataSize > 0) {
      // Bulk out
      let dataOut: Uint8Array;
      if (dataSize === restData) {
        dataOut = _CRandomData(restData, false);
      } else {
        dataOut = _CRandomData(chunk, false);
      }
      startTime = performance.now();
      await webDevice.transferOut(bulkOutEndpoint.endpointNumber, dataOut);

      // Bulk in
      const resultIn = await webDevice.transferIn(
        bulkInEndpoint.endpointNumber,
        dataOut.length
      );
      endTime = performance.now();
      if (!resultIn.data) {
        throw new Error("Bulk in 데이터를 수신하지 못했습니다.");
      }
      const dataIn = new Uint8Array(resultIn.data?.buffer);

      dataSize -= chunk;
      time += endTime - startTime;

      // printResult(dataOut, dataIn, dataOut.length);
      mbpsArr.push(calculateMbps(startTime, endTime, dataOut.length));
    }

    console.log("===============");
    let sum = 0;
    let avg = 0;
    let max = 0;
    let min = Infinity; // 초기 최소값은 무한대로 설정
    let std = 0;
    let varianceSum = 0;

    for (let i = 0; i < mbpsArr.length; i++) {
      const value = mbpsArr[i] ?? 0;
      sum += value;
      avg = sum / (i + 1);
      max = Math.max(max, value);
      min = Math.min(min, value);
    }

    // 표준편차 계산
    for (let i = 0; i < mbpsArr.length; i++) {
      varianceSum += Math.pow((mbpsArr[i] ?? 0) - avg, 2);
    }
    std = Math.sqrt(varianceSum / mbpsArr.length);

    console.log(
      `최대값: ${max.toFixed(2)}, 최소값: ${min.toFixed(
        2
      )}, 표준편차: ${std.toFixed(2)}`
    );
    console.log("통신 시간: ", (time / 1000).toFixed(2));
    console.log("===============");

    // 성능 계산
    const avgPref = mbpsArr.reduce((a, b) => a + b, 0) / mbpsArr.length;
    console.log(
      `********** ${bytes}bytes - ${chunk}bytes 성능: ${avgPref.toFixed(
        2
      )} Mbps **********`
    );
    return {
      averagePref: avgPref,
    };
  } catch (error) {
  } finally {
    await closeDevice(webDevice);
  }
}

/************************** WebUSB *******************************/
export const webUSBList = async () => {
  const devices = await usb.webusb.getDevices();
  console.log(devices);
  return devices;
};
