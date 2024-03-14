import {
  CiBuffer,
  CiBufferSize,
  CiHead,
  CiHeadSize,
  FWInfo,
} from "./types/fw-info";

/**
 * Firmware info
 */
let ciBuffer: CiBuffer = {
  bootState: "",
  zeroizeState: "",
  chipId: "",
  NOPWState: "",
  SOPWState: "",
  RemoteZero: "",
  keyDiag: "",
  cryptoDiag: "",
  sensorDiag: "",
  nandDiag: "",
  prngDiag: "",
  serialNumber: "",
};

/**
 * Uint8 배열을 16진수 배열로 변환
 * @param dataIn Uint8Array
 * @returns 16진수 배열
 */
function convertArrayUint8ToHex(dataIn: Uint8Array): string[] {
  // 10진수 배열을 16진수 배열로 변환
  // JS에서는 16진수를 문자로 다룸
  const hexDataIn = Array.from(dataIn).map((byte) =>
    byte.toString(16).padStart(2, "0").toUpperCase()
  );
  return hexDataIn;
}

/**
 * 16진수 배열을 endian을 고려하여 파싱 및 출력.
 * Serial Number의 경우는 ASCII 코드로 변환하여 출력.
 * @param hexArray 16진수 배열
 * @param index 각 원소들이 들어갈 자리
 */
function parseCiBuffer(hexArray: string[], index: number): void {
  // ciBuffer 값 파싱 후 할당
  Object.entries(CiBufferSize).map(([key, value]) => {
    let hexValue = [];
    for (let i = 0; i < value; i++) {
      hexValue[i] = hexArray[index];
      index++;
    }
    // serialNumber의 경우, ASCII 문자로 변환
    if (key === "serialNumber") {
      let asciiString: string = "";
      hexValue.map((hex) => {
        if (hex !== undefined) {
          const asciiHex = parseInt(hex, 16);

          asciiString += String.fromCharCode(asciiHex);
        }
      });
      ciBuffer[key] = asciiString;
    } else {
      ciBuffer[key] = hexValue.reverse().join("");
    }
  });
}

/**
 * trans in buffer를 파싱하는 함수
 * @param hexDataIn 16진수 배열
 * @param command fw 명령 번호
 * @returns
 */
export function parseTransInData(dataIn: Uint8Array, command: number): FWInfo {
  const hexDataIn = convertArrayUint8ToHex(dataIn);

  let ciHead: CiHead = {
    CMD: "",
    SID: "",
    DL: "",
    RV: "",
    rsv: "",
  };

  // 할당할 값의 index
  let index: number = 0;

  // ciHead 값 파싱 후 할당
  Object.entries(CiHeadSize).map(([key, value]) => {
    let hexValue = [];
    for (let i = 0; i < value; i++) {
      hexValue[i] = hexDataIn[index];
      index++;
    }
    ciHead[key] = `0x${hexValue.reverse().join("")}`;
  });

  if (command === 2) {
    parseCiBuffer(hexDataIn, index);
    return {
      ciHead,
      ciBuffer,
      restData: hexDataIn.slice(index),
    };
  } else if (command === 4) {
    return {
      ciHead,
      restData: hexDataIn.slice(index, 64),
    };
  }
  return {
    ciHead,
    restData: hexDataIn.slice(index),
  };
}

/**
 * 10진수 배열을 1줄에 16개씩 16진수로 출력
 * @param array number array
 */
export function printUint8ToHex(array: Uint8Array): void {
  array.forEach((value: number, index: number) => {
    const hex = value.toString(16).padStart(2, "0").toUpperCase();
    process.stdout.write(`${hex} `);
    if ((index + 1) % 16 === 0) process.stdout.write("\n");
  });
}

/**
 * ciBuffer부분만을 따로 파싱하여 출력
 * @param dataIn trans in data
 */
export function printCiBuffer(dataIn: Uint8Array): void {
  const hexDataIn = convertArrayUint8ToHex(dataIn);
  parseCiBuffer(hexDataIn, 16);
  console.log();
  Object.entries(ciBuffer).forEach(([key, value]) => {
    const paddedKey = key.padEnd(20, " ");
    console.log(`${paddedKey}: [${value}]`);
  });
  console.log();
}

/**
 * serialNumber를 문자로 변환 후 반환하는 함수
 * @param resultIn TransIn 데이터
 * @returns serialNumber
 */
export function getSerialNumberFromArrayBuffer(resultIn: USBInTransferResult) {
  // serialNumber 시작 인덱스
  const startIndex = 32;
  // serialNumber 끝 인덱스
  const endIndex = startIndex + CiBufferSize.serialNumber;

  // 데이터 체크
  if (!resultIn.data) {
    throw new Error("Buffer 데이터를 확인할 수 없습니다.");
  }
  // 데이터 추출
  const dataSlice = new Uint8Array(
    resultIn.data?.buffer.slice(startIndex, endIndex)
  );
  // 데이터 변환
  const ascii = String.fromCharCode(...dataSlice);

  return ascii;
}
