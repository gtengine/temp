const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");
/******************************************************************** */

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // 배포 환경일 때, 정적 파일 로드
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    // 개발 환경일 때, localhost 로드
    win.loadURL("http://localhost:3000");
    // win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      // 페이지 로드 실패했을 경우, 캐시 무시하고 다시 로드
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindow();

  // 장치 리스트
  ipcMain.on("req-device-list", (event, message) => {
    console.log(message);
    event.sender.send("res-device-list", "response from main");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
