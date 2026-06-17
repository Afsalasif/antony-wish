'use client'

// An emotional, cinematic ambient synth using Web Audio API.
// Creates a beautiful, warm, low-pass filtered chord progression
// with a slow, sparkling music-box melody in Db major.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let filter: BiquadFilterNode | null = null
let timer: number | null = null

// Db major scale notes for chords and melody (in Hz)
const CHORDS = [
  // Db Major: Db3 (138.59), Ab3 (207.65), F4 (349.23), Db5 (554.37)
  [138.59, 207.65, 349.23, 554.37],
  // Ab Major: C3 (130.81), Ab3 (207.65), Eb4 (311.13), C5 (523.25)
  [130.81, 207.65, 311.13, 523.25],
  // Bb minor: Bb2 (116.54), F3 (174.61), Db4 (277.18), Bb4 (466.16)
  [116.54, 174.61, 277.18, 466.16],
  // Gb Major: Gb2 (92.50), Db3 (138.59), Bb3 (233.08), Gb4 (369.99)
  [92.50, 138.59, 233.08, 369.99]
]

const MELODY_SCALE = [
  277.18, // Db4
  311.13, // Eb4
  349.23, // F4
  415.30, // Ab4
  466.16, // Bb4
  554.37, // Db5
  622.25, // Eb5
  698.46, // F5
  830.61, // Ab5
]

let progressionIndex = 0

function note(freq: number, time: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  if (!ctx || !master || !filter) return
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = type
  osc.frequency.value = freq
  
  // Custom ADSR-like envelope for a soft instrument
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + 0.12) // soft attack
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur) // natural decay
  
  osc.connect(gain)
  gain.connect(filter)
  
  osc.start(time)
  osc.stop(time + dur + 0.1)
}

export function startMusic() {
  if (typeof window === 'undefined') return
  
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Master volume control
    master = ctx.createGain()
    master.gain.value = 0.22
    
    // Low pass filter to make the synthesis sound soft and cozy
    filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(650, ctx.currentTime) // filter out harsh highs
    filter.Q.setValueAtTime(1.2, ctx.currentTime)
    
    filter.connect(master)
    master.connect(ctx.destination)
  }
  
  void ctx.resume()
  if (timer) return

  const step = () => {
    if (!ctx) return
    const now = ctx.currentTime
    
    // Get the current chord frequencies
    const chord = CHORDS[progressionIndex % CHORDS.length]
    
    // Play warm bass and pad tones (longer duration)
    note(chord[0], now, 3.8, 0.05, 'triangle') // bass foundation
    note(chord[1], now + 0.1, 3.5, 0.04, 'sine')   // harmony
    note(chord[2], now + 0.2, 3.2, 0.03, 'sine')   // warmth
    
    // Play a sparkling, bell-like melody overlay
    // Select notes from the scale that complement the chord
    const root = MELODY_SCALE[Math.floor(Math.random() * MELODY_SCALE.length)]
    const third = MELODY_SCALE[Math.floor(Math.random() * MELODY_SCALE.length)]
    
    // Spread the melody notes with delay to sound like a music box
    note(root, now + 0.4, 1.8, 0.06, 'sine')
    note(third, now + 1.2, 1.6, 0.05, 'sine')
    
    if (Math.random() > 0.4) {
      const highNote = MELODY_SCALE[Math.floor(Math.random() * 4) + 5] // pick a higher octave note
      note(highNote, now + 2.0, 1.2, 0.03, 'sine')
    }

    progressionIndex++
  }

  step()
  timer = window.setInterval(step, 3600) // 3.6 seconds per bar
}

export function stopMusic() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  if (master && ctx) {
    master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
  }
}

