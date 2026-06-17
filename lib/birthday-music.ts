'use client'

// Web Audio API Synthesizer and Audio Player for the Cosmic Birthday Experience.
// Plays the uploaded background track (ayiram.mp3) on a loop,
// and synthesizes interactive stardust bells and the final "Happy Birthday" melody.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let filter: BiquadFilterNode | null = null

let bgMusic: HTMLAudioElement | null = null
let melodyTimer: number | null = null
let isMelodyPlaying = false

// Pentatonic scale for user click chime synthesis (Db Major Pentatonic)
const PENTATONIC = [
  277.18, // Db4
  311.13, // Eb4
  349.23, // F4
  415.30, // Ab4
  466.16, // Bb4
  554.37, // Db5
  622.25, // Eb5
  698.46, // F5
  830.61, // Ab5
  932.33  // Bb5
]

// Happy Birthday melody in Db Major
// Array of [frequency, duration_in_beats, pause_after_note_in_beats]
// Tempo: 120 bpm (0.5s per beat)
const HAPPY_BIRTHDAY_MELODY: [number, number, number][] = [
  [277.18, 0.75, 0.25], // Happy (Db4)
  [277.18, 0.25, 0.25], // birth (Db4)
  [311.13, 1.0, 0.0],   // day (Eb4)
  [277.18, 1.0, 0.0],   // to (Db4)
  [369.99, 1.0, 0.0],   // you (Gb4)
  [349.23, 2.0, 1.0],   // , (F4)

  [277.18, 0.75, 0.25], // Happy (Db4)
  [277.18, 0.25, 0.25], // birth (Db4)
  [311.13, 1.0, 0.0],   // day (Eb4)
  [277.18, 1.0, 0.0],   // to (Db4)
  [415.30, 1.0, 0.0],   // you (Ab4)
  [369.99, 2.0, 1.0],   // , (Gb4)

  [277.18, 0.75, 0.25], // Happy (Db4)
  [277.18, 0.25, 0.25], // birth (Db4)
  [554.37, 1.0, 0.0],   // day (Db5)
  [466.16, 1.0, 0.0],   // dear (Bb4)
  [369.99, 1.0, 0.0],   // Koche (Gb4)
  [349.23, 1.0, 0.0],   // (F4)
  [311.13, 2.0, 1.0],   // , (Eb4)

  [493.88, 0.75, 0.25], // Happy (B4 / Cb5)
  [493.88, 0.25, 0.25], // birth (B4)
  [466.16, 1.0, 0.0],   // day (Bb4)
  [369.99, 1.0, 0.0],   // to (Gb4)
  [415.30, 1.0, 0.0],   // you (Ab4)
  [369.99, 3.0, 2.0]    // . (Gb4)
]

function initAudio() {
  if (typeof window === 'undefined') return
  
  // 1. Initialize Web Audio API context for interactive soundbox bells
  if (!ctx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AudioContextClass()
    
    master = ctx.createGain()
    master.gain.value = 0.16
    
    filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.Q.setValueAtTime(1.0, ctx.currentTime)
    
    filter.connect(master)
    master.connect(ctx.destination)
  }
  
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  // 2. Initialize HTML5 Audio Element for custom background music
  if (!bgMusic) {
    bgMusic = new Audio('/ayiram.mp3')
    bgMusic.loop = true
    bgMusic.volume = 0.75 // Set louder volume
    bgMusic.load() // Preload the audio file
  }
}

// Low level synthesizer note function
function playSynthNote(freq: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  if (!ctx || !filter) return
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = type
  osc.frequency.value = freq
  
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  
  osc.connect(gain)
  gain.connect(filter)
  
  osc.start(start)
  osc.stop(start + duration + 0.1)
}

// 1. Play background song (ayiram.mp3)
export function startAmbientMusic() {
  if (typeof window === 'undefined') return
  initAudio()
  
  if (bgMusic && bgMusic.paused && !isMelodyPlaying) {
    bgMusic.volume = 0.75
    void bgMusic.play().catch((err) => console.log('Audio autoplay blocked:', err))
  }
}

// Helper to fade out HTML5 audio smoothly
function fadeOutAudio(audio: HTMLAudioElement, duration = 800, callback?: () => void) {
  const startVolume = audio.volume
  const steps = 16
  const interval = duration / steps
  let currentStep = 0
  
  const fade = setInterval(() => {
    currentStep++
    audio.volume = Math.max(0, startVolume - startVolume * (currentStep / steps))
    if (currentStep >= steps) {
      clearInterval(fade)
      audio.pause()
      audio.volume = startVolume // restore default volume
      if (callback) callback()
    }
  }, interval)
}

// 2. Stop/Mute background song
export function stopAmbientMusic() {
  if (bgMusic && !bgMusic.paused) {
    fadeOutAudio(bgMusic)
  }
}

// 3. Play interactive sound box bell (from screen click)
export function playStardustChime(yRatio: number) {
  initAudio()
  if (!ctx) return
  
  const now = ctx.currentTime
  const noteIndex = Math.min(
    Math.floor((1 - yRatio) * PENTATONIC.length),
    PENTATONIC.length - 1
  )
  const frequency = PENTATONIC[noteIndex]
  
  // Pluck chime
  playSynthNote(frequency, now, 1.8, 0.12, 'sine')
  // Sparkling higher chime overlay
  playSynthNote(frequency * 2, now + 0.02, 1.0, 0.05, 'sine')
}

// 4. Play "Happy Birthday" melody (music box synth)
export function playHappyBirthday() {
  startAmbientMusic()
}

export function stopMelody() {
  if (melodyTimer) {
    window.clearTimeout(melodyTimer)
    melodyTimer = null
  }
  isMelodyPlaying = false
}
