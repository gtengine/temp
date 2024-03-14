const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("device", {
  requestDeviceList: (message) => ipcRenderer.send("req-device-list", message),
  responseDeviceList: (callback) =>
    ipcRenderer.on("res-device-list", (event, message) => callback(message)),
});
