'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, Mic, MicOff, Star, Gift, RotateCcw } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'
import { playHappyBirthday, stopMelody } from '@/lib/birthday-music'

function triggerConfettiBurst() {
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({
      origin: { y: 0.75 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
      ...opts,
      particleCount: Math.floor(180 * ratio),
    })
  fire(0.25, { spread: 30, startVelocity: 60 })
  fire(0.2, { spread: 70 })
  fire(0.35, { spread: 110, decay: 0.92, scalar: 1.0 })
  fire(0.1, { spread: 130, startVelocity: 30, decay: 0.93 })
  fire(0.1, { spread: 130, startVelocity: 50 })
}

export function BirthdayCake() {
  const [blownOut, setBlownOut] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [micError, setMicError] = useState(false)
  const [showScroll, setShowScroll] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const handleBlowOut = () => {
    if (blownOut) return
    haptic('success')
    setBlownOut(true)
    triggerConfettiBurst()
    playHappyBirthday()
    
    // Disable mic recording immediately
    stopMicTracking()
    setMicActive(false)

    // Delayed display of letter scroll
    setTimeout(() => {
      setShowScroll(true)
    }, 1500)
  }

  const stopMicTracking = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  const startMicTracking = async () => {
    try {
      setMicError(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setMicActive(true)

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      
      analyser.fftSize = 256
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const checkBlow = () => {
        if (!streamRef.current) return

        analyser.getByteFrequencyData(dataArray)
        
        // Sum amplitude in mid-high frequency bins where blowing sounds reside
        let sum = 0
        for (let i = 10; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const avg = sum / (bufferLength - 10)

        // If average blow volume is high enough
        if (avg > 70) {
          handleBlowOut()
          return
        }

        animationRef.current = requestAnimationFrame(checkBlow)
      }

      checkBlow()
    } catch (err) {
      console.error('Mic initialization failed:', err)
      setMicActive(false)
      setMicError(true)
    }
  }

  const handleToggleMic = () => {
    haptic('tap')
    if (micActive) {
      stopMicTracking()
      setMicActive(false)
    } else {
      startMicTracking()
    }
  }

  const handleReset = () => {
    haptic('tap')
    stopMelody()
    setBlownOut(false)
    setShowScroll(false)
    stopMicTracking()
    setMicActive(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicTracking()
      stopMelody()
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-start h-full w-full max-w-lg mx-auto p-4 select-none">
      {/* Header Info */}
      <div className="mb-4 text-center mt-2 z-10">
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-glow flex items-center justify-center gap-1.5">
          <Star className="size-5 text-amber-400 fill-amber-400/20" />
          Make a Birthday Wish
        </h2>
        <p className="text-xs md:text-sm text-foreground/60 mt-1.5 max-w-[290px] md:max-w-md mx-auto">
          {blownOut 
            ? "Koche, the candle is blown! Let the music play." 
            : "Tap the candle flame directly to blow it out, or turn on the microphone and blow into it!"}
        </p>
      </div>

      {/* Main Cake Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[35vh] w-full">
        {/* Confetti celebration rain effect */}
        {blownOut && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-2 left-10 size-3 rounded-full bg-pink-400 animate-ping" />
            <div className="absolute top-20 right-16 size-4 rounded-full bg-gold animate-bounce" />
            <div className="absolute bottom-10 left-16 size-2.5 rounded-full bg-sky-400" />
          </div>
        )}

        <div className="relative flex flex-col items-center md:scale-125 md:my-12 transition-transform duration-300">
          {/* Candle Flame & Wick */}
          <div className="relative z-20 flex flex-col items-center" style={{ transform: 'translateY(8px)' }}>
            <AnimatePresence mode="wait">
              {!blownOut ? (
                /* Flickering SVG Flame */
                <motion.div
                  key="flame"
                  onClick={handleBlowOut}
                  className="cursor-pointer"
                  animate={{
                    scale: [1, 1.08, 0.95, 1.05, 1],
                    skewX: [-1, 2, -2, 1, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Glowing flame layers */}
                  <div className="relative size-7 flex items-center justify-center">
                    {/* Outer Glow */}
                    <div className="absolute bottom-0 size-8 rounded-full bg-amber-500/30 blur-md pointer-events-none" />
                    {/* Outer Flame shape */}
                    <div className="w-4 h-7 bg-gradient-to-t from-amber-600 via-yellow-500 to-amber-300 rounded-t-full rounded-b-2xl shadow-lg shadow-amber-500/40" />
                    {/* Inner core flame shape */}
                    <div className="absolute bottom-0.5 w-2 h-4 bg-gradient-to-t from-rose-500 via-sky-200 to-white rounded-t-full rounded-b-xl" />
                  </div>
                </motion.div>
              ) : (
                /* Smoke Particle on Blowout */
                <motion.div
                  key="smoke"
                  initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, y: -45, scale: 2.2 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="size-3 bg-stone-400 rounded-full blur-xs pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Candle Stick */}
            <div className="h-14 w-3 rounded-t-md bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400 border border-white/20 shadow-md relative">
              {/* Wick */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-0.5 bg-stone-700" />
              {/* Stripes */}
              <div className="absolute top-3 inset-x-0 h-1 bg-white/30 rotate-12" />
              <div className="absolute top-7 inset-x-0 h-1 bg-white/30 rotate-12" />
            </div>
          </div>

          {/* Birthday Cake Drawing (SVG layered) */}
          <div className="relative flex flex-col items-center">
            {/* Top Frosting Drips */}
            <div className="h-4 w-36 bg-pink-100 rounded-t-full relative z-10 shadow-xs" />
            {/* Cake Layer 1 (Top) */}
            <div className="h-10 w-36 bg-gradient-to-b from-stone-50 to-pink-50 border-x border-white/20 shadow-md flex items-center justify-around px-2">
              <span className="size-1 rounded-full bg-pink-400" />
              <span className="size-1 rounded-full bg-indigo-400" />
              <span className="size-1 rounded-full bg-amber-400" />
              <span className="size-1 rounded-full bg-pink-400" />
              <span className="size-1 rounded-full bg-emerald-400" />
            </div>

            {/* Middle Cream Line */}
            <div className="h-2 w-44 bg-rose-400 rounded-full relative z-10 shadow-md" />

            {/* Cake Layer 2 (Bottom) */}
            <div className="h-16 w-44 bg-gradient-to-b from-stone-50 to-rose-50 border-x border-white/20 rounded-b-xl shadow-lg flex items-center justify-around px-4">
              <span className="size-1.5 rounded-full bg-purple-400" />
              <span className="size-1.5 rounded-full bg-amber-400" />
              <span className="size-1.5 rounded-full bg-sky-400" />
              <span className="size-1.5 rounded-full bg-rose-400" />
            </div>

            {/* Cake Plate */}
            <div className="h-3.5 w-52 bg-white/25 backdrop-blur-xs border border-white/20 rounded-full shadow-xl flex items-center justify-center -mt-1 relative z-10">
              {/* Plate highlight */}
              <div className="h-1 w-44 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Audio Mic Button (Only show if not blown out) */}
        {!blownOut && (
          <div className="mt-8 flex flex-col items-center gap-1.5">
            <button
              onClick={handleToggleMic}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-md active:scale-95 transition cursor-pointer ${
                micActive
                  ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
              }`}
            >
              {micActive ? <Mic className="size-3.5 animate-bounce" /> : <MicOff className="size-3.5" />}
              <span>{micActive ? 'Mic Active: Blow now!' : 'Enable Mic Blow'}</span>
            </button>
            {micError && (
              <p className="text-[10px] text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg px-2 py-0.5 mt-1">
                Permission denied or unsupported. Tap flame instead!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Retro/Elegent Birthday Letter Scroll */}
      <AnimatePresence>
        {showScroll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 overflow-y-auto">
            {/* Dark blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
            />

            {/* Glowing scroll envelope container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative z-10 w-full max-w-md md:max-w-lg bg-[#fefdfa] border-2 border-stone-200 p-6 md:p-8 rounded-2xl text-stone-900 font-serif shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Paper border/filigree accent */}
              <div className="absolute inset-2 border border-stone-200/50 pointer-events-none rounded-xl" />

              {/* Reset button at top right */}
              <button
                onClick={handleReset}
                type="button"
                className="absolute top-4 right-4 text-[10px] uppercase font-mono text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer transition border border-stone-200 rounded-lg px-2 py-1 bg-stone-50"
              >
                <RotateCcw className="size-2.5" />
                Reset
              </button>

              {/* Heart Stamp Header */}
              <div className="flex justify-center mb-4 mt-2">
                <div className="size-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xs">
                  <Gift className="size-4 fill-current animate-bounce" />
                </div>
              </div>

              {/* Letter Title */}
              <h3 className="text-xl font-bold italic text-stone-850 text-center border-b border-stone-200/60 pb-3.5 mb-5 uppercase tracking-wide">
                {CONFIG.birthdayWishTitle}
              </h3>

              {/* Letter Content */}
              <div className="space-y-4 font-serif text-stone-800 text-sm leading-relaxed text-left max-w-sm mx-auto">
                <p className="font-semibold text-stone-900">{CONFIG.letter.salutation}</p>
                {CONFIG.letter.paragraphs.map((p, idx) => (
                  <p key={idx} className="indent-4 leading-relaxed text-stone-700 text-pretty">
                    {p}
                  </p>
                ))}
                
                {/* Closing */}
                <div className="pt-4 border-t border-stone-200/30 text-right">
                  <p className="italic text-stone-600 text-xs">{CONFIG.letter.closing}</p>
                  <p className="font-bold text-stone-950 text-base mt-1 font-heading">{CONFIG.letter.signature}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
