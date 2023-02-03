"use strict"
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
const electron_1 = require("electron")
const webchimera_js_1 = __importDefault(require("webchimera.js"))
let wc = null
const preload = {
  webchimera: {
    setup(args) {
      wc = webchimera_js_1.default.createPlayer(args)
    },
    isOk() {
      return !!wc
    },
    onTimeChanged(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onTimeChanged = (time) => listener(time)
    },
    onLogMessage(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onLogMessage = (level, message) => listener(level, message)
    },
    onFrameReady(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onFrameReady = (frame) =>
        listener(frame, frame.width, frame.height, frame.uOffset, frame.vOffset)
    },
    onMediaChanged(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onMediaChanged = () => listener()
    },
    onEncounteredError(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onEncounteredError = () => listener()
    },
    onBuffering(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onBuffering = (p) => listener(p)
    },
    onStopped(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onStopped = () => listener()
    },
    onEndReached(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onEndReached = () => listener()
    },
    onPaused(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onPaused = () => listener()
    },
    onPlaying(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onPlaying = () => listener()
    },
    onSeekableChanged(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onSeekableChanged = (isSeekable) => listener(isSeekable)
    },
    onPositionChanged(listener) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.onPositionChanged = (position) => listener(position)
    },
    destroy() {
      wc?.close()
      wc = null
    },
    setVolume(volume) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.volume = volume
    },
    play(url) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.play(url)
    },
    togglePause() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.togglePause()
    },
    stop() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.stop()
    },
    hasVout() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      return wc.input.hasVout
    },
    isPlaying() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      return wc.playing
    },
    getSubtitleTrack() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      return wc.subtitles.track
    },
    setSubtitleTrack(track) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.subtitles.track = track
    },
    getAudioChannel() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      return wc.audio.channel
    },
    setAudioChannel(channel) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.audio.channel = channel
    },
    setPosition(position) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.position = position
    },
    getAudioTracks() {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      return [...Array(wc.audio.count).keys()].map(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (trackId) => wc.audio[trackId]
      )
    },
    setAudioTrack(track) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.audio.track = track
    },
    setSpeed(speed) {
      if (!wc) {
        throw new Error("wc is not initialized")
      }
      wc.input.rate = speed
    },
  },
}
electron_1.contextBridge.exposeInMainWorld("Preload", preload)
