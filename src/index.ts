import { app, BrowserWindow } from "electron"

app.on("ready", async () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: `${__dirname}/../preload.js`,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })
  window.loadFile("index.html")
})
