/**
 * ci head의 속성들의 type
 */
export interface CiHead {
  CMD: string;
  SID: string;
  DL: string;
  RV: string;
  rsv: string;
  [key: string]: string;
}

/**
 * ci head 속성들의 byte size
 */
export const CiHeadSize = {
  CMD: 2,
  SID: 2,
  DL: 4,
  RV: 4,
  rsv: 4,
};

/**
 * ci buffer 속성들의 type
 */
export interface CiBuffer {
  bootState: string;
  zeroizeState: string;
  chipId: string;
  NOPWState: string;
  SOPWState: string;
  RemoteZero: string;
  keyDiag: string;
  cryptoDiag: string;
  sensorDiag: string;
  nandDiag: string;
  prngDiag: string;
  serialNumber: string;
  [key: string]: string;
}

/**
 * ci buffer 속성들의 byte size
 */
export const CiBufferSize = {
  bootState: 2,
  zeroizeState: 2,
  chipId: 4,
  NOPWState: 1,
  SOPWState: 1,
  RemoteZero: 1,
  keyDiag: 1,
  cryptoDiag: 1,
  sensorDiag: 1,
  nandDiag: 1,
  prngDiag: 1,
  serialNumber: 24,
};

export interface FWInfo {
  ciHead: CiHead;
  ciBuffer?: CiBuffer;
  restData: string[];
}

`
  bootState        (CC33) BOOT_CSP_OK[2]
  zeroizeState     (55FF) NONE[2]
  chipId           (   0) 0[4]
  NOPWState        (  A5) PW_DEFAULT[2]
  SOPWState        (  5A) PW_NEW[2]
  RemoteZero       (  AA) REMOTE_CMD_OFF[1]
  keyDiag          (  FF) DIAG_NO[1]
  cryptoDiag       (  FF) DIAG_NO[1]
  sensorDiag       (  FF) DIAG_NO[1]
  nandDiag         (  FF) DIAG_NO[1]
  prngDiag         (  FF) DIAG_NO[1]
  serialnumber            A000010-H01-B02-C03-DEV
  `;
