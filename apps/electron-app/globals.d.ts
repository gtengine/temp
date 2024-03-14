interface Window {
  device: {
    requestDeviceList: (message: string) => void;
    responseDeviceList: (callback: (message: any) => void) => void;
  };
}
