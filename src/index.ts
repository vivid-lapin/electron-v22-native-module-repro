import { setTimeout } from "timers/promises"
import { app, BrowserWindow } from "electron"

app.on("ready", async () => {
  const browser = new BrowserWindow({
    titleBarStyle: "hiddenInset",
    titleBarOverlay: true,
  })
  await setTimeout(1000)
  browser.setWindowButtonVisibility(false)
  await setTimeout(1000)
  browser.setFullScreen(true)
  await setTimeout(1000)
  browser.setFullScreen(false)
  await setTimeout(1000)
  browser.setWindowButtonVisibility(true)
  // No traffic lights!
})
