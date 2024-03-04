import { printUint8ToHex } from "./fw-info";

// 전체 데이터 크기
export const DATA_SIZE = 8192;
// 데이터 주입 index
const DATA_INDEX = 16;

/** looback data */
export function _CLoopBack() {
  const commandData = new Uint8Array(DATA_SIZE);
  // CMD
  [commandData[0], commandData[1]] = [0x01, 0x00];
  // DL
  [commandData[4], commandData[5], commandData[6], commandData[7]] = [
    0x00, 0x02, 0x00, 0x00,
  ];

  // 데이터 주입
  for (let i = 0; i < 0x00000200; i++) {
    commandData[DATA_INDEX + i] = i & 0xff;
  }

  return commandData;
}

/** getFWInfo data */
export function _CGetFWInfo() {
  const commandData = new Uint8Array(DATA_SIZE);
  // CMD
  [commandData[0], commandData[1]] = [0x10, 0x40];
  return commandData;
}

/** setSerialNumber data */
export function _CSetSerialNumber(serialNum: string) {
  const commandData = new Uint8Array(DATA_SIZE);
  // CMD
  [commandData[0], commandData[1]] = [0x11, 0x80];
  // DL
  [commandData[4], commandData[5], commandData[6], commandData[7]] = [
    0x00, 0x18, 0x00, 0x00,
  ];

  // 문자열 숫자로 변환하여 주입
  [...serialNum.toUpperCase()].map((value, index) => {
    if (index < 24)
      commandData[DATA_INDEX + index] = Number(
        `0x${value.charCodeAt(0).toString(16)}`
      );
  });

  return commandData;
}

/** swReset data */
export function _CSWReset() {
  const commandData = new Uint8Array(DATA_SIZE);
  [commandData[0], commandData[1]] = [0x02, 0xc0];
  return commandData;
}

/** Random data */
export function _CRandomData(bytes: number, isRandom: boolean) {
  const commandData = new Uint8Array(bytes);
  // loopback 통신
  [commandData[0], commandData[1]] = [0x01, 0x00];

  // DL 변환 및 주입
  const dl = isRandom ? bytes - 16 : 512;
  const convertedDl = dl
    .toString(16)
    .padStart(8, "0")
    .match(/.{1,2}/g)
    ?.reverse();

  convertedDl?.forEach((value: string, index: number) => {
    commandData[4 + index] = Number(`0x${value}`);
  });

  // 랜덤 데이터 주입
  if (isRandom) {
    for (let i = DATA_INDEX; i < bytes; i++) {
      commandData[i] = Math.floor(Math.random() * 256);
    }
  } else {
    for (let i = 0; i < 512; i++) {
      commandData[i + DATA_INDEX] = i < 256 ? i : i - 256;
    }
  }
  return commandData;
}
