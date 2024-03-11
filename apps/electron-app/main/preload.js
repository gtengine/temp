const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("device", {
  sendMessage: (message) => ipcRenderer.send("req-device-list", message),
  receiveMessage: (callback) =>
    ipcRenderer.on("res-device-list", (event, message) => callback(message)),
});
