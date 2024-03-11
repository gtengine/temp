interface Window {
  device: {
    sendMessage: (message: string) => void;
    receiveMessage: (callback: (message: any) => void) => void;
  };
}
