'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Heart, ArrowRight } from 'lucide-react'
import { CONFIG, type CapsuleWish } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

export function WishJar() {
  const [activeCapsule, setActiveCapsule] = useState<CapsuleWish | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCount, setDrawnCount] = useState(0)

  const handleDraw = () => {
    if (isDrawing) return
    haptic('tap')
    setIsDrawing(true)
    setActiveCapsule(null)

    // Select random capsule
    const available = CONFIG.capsules
    const randomIndex = Math.floor(Math.random() * available.length)
    const selection = available[randomIndex]

    // Simulate jar shake and capsule float up delay
    setTimeout(() => {
      haptic('success')
      setActiveCapsule(selection)
      setIsDrawing(false)
      setDrawnCount((c) => c + 1)
    }, 1200)
  }

  const handleDismiss = () => {
    haptic('tap')
    setActiveCapsule(null)
  }

  return (
    <div className="relative flex flex-col h-full w-full max-w-lg mx-auto p-4 select-none">
      {/* Header */}
      <div className="mb-4 text-center mt-2 z-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-glow flex items-center justify-center gap-1.5">
          <Gift className="size-5 text-rose-400" />
          The Capsule Wish Jar
        </h2>
        <p className="text-xs text-foreground/60 mt-1 max-w-[290px] mx-auto">
          Afzal filled this jar with custom blessings & birthday coupons. Tap the jar to draw a capsule.
        </p>
      </div>

      {/* Main Game Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[45vh]">
        {/* Interactive Glowing Jar */}
        <motion.div
          animate={isDrawing ? {
            rotate: [-4, 4, -4, 4, -2, 2, 0],
            scale: [1, 1.05, 0.95, 1],
          } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onClick={handleDraw}
          className="relative cursor-pointer flex flex-col items-center group"
        >
          {/* Glowing Aura behind jar */}
          <div className="absolute inset-0 -z-10 rounded-full bg-radial from-rose-500/20 via-transparent to-transparent opacity-80 blur-xl group-hover:from-rose-500/35 transition duration-500" />

          {/* Jar Lid */}
          <div className="h-4 w-28 rounded-t-xl border border-white/20 bg-stone-100 shadow-md relative z-10 flex items-center justify-center">
            <div className="h-1 w-20 bg-stone-300 rounded-full" />
          </div>
          {/* Jar Neck */}
          <div className="h-3 w-24 border-x border-white/25 bg-gradient-to-r from-white/10 to-white/30 backdrop-blur-xs relative z-10" />

          {/* Jar Body */}
          <div className="relative h-64 w-52 rounded-b-[4.5rem] rounded-t-2xl border border-white/20 bg-gradient-to-b from-white/5 to-white/20 backdrop-blur-md shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Water/Glow line */}
            <div className="absolute bottom-4 inset-x-4 h-28 rounded-b-[4rem] bg-rose-400/10 border-t border-rose-300/10 filter blur-md pointer-events-none" />

            {/* Glowing floating capsules inside jar (purely animated CSS blobs) */}
            <div className="absolute inset-4 overflow-hidden pointer-events-none">
              {CONFIG.capsules.map((cap, i) => {
                // Determine a random floating animation offset
                const offsets = [
                  { x: '25%', y: '40%', scale: 0.8, dur: 4.5, delay: 0 },
                  { x: '60%', y: '30%', scale: 0.9, dur: 5.2, delay: 0.5 },
                  { x: '45%', y: '65%', scale: 1.0, dur: 3.8, delay: 1.2 },
                  { x: '15%', y: '60%', scale: 0.85, dur: 4.8, delay: 0.2 },
                  { x: '75%', y: '55%', scale: 0.75, dur: 5.0, delay: 1.8 },
                  { x: '35%', y: '15%', scale: 0.9, dur: 4.2, delay: 0.8 },
                ]
                const config = offsets[i % offsets.length]
                const colors = [
                  'bg-rose-400',
                  'bg-amber-400',
                  'bg-indigo-400',
                  'bg-emerald-400',
                  'bg-purple-400',
                ]
                const color = colors[i % colors.length]

                return (
                  <motion.div
                    key={cap.id}
                    className={`absolute size-4 rounded-full ${color} opacity-40 shadow-[0_0_12px_rgba(255,255,255,0.4)]`}
                    style={{
                      left: config.x,
                      top: config.y,
                      transform: `scale(${config.scale})`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 8, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: config.dur,
                      repeat: Infinity,
                      delay: config.delay,
                      ease: 'easeInOut',
                    }}
                  />
                )
              })}
            </div>

            {/* Glowing Core Sparkle */}
            <Sparkles className="size-10 text-rose-300/55 animate-pulse" />
          </div>

          {/* Prompt banner */}
          <div className="mt-4 rounded-full bg-rose-500/15 border border-rose-400/30 px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300 group-hover:bg-rose-500/25 transition">
            {isDrawing ? 'Drawing capsule...' : 'Tap jar to draw'}
          </div>
        </motion.div>
      </div>

      {/* Drawing Loading Spinner / Floating Capsule Animation */}
      <AnimatePresence>
        {isDrawing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs"
          >
            <motion.div
              animate={{
                y: [60, -80],
                scale: [0.3, 1.4],
                rotate: [0, 720],
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="size-16 rounded-full bg-gradient-to-br from-rose-400 to-indigo-500 shadow-2xl flex items-center justify-center"
            >
              <Heart className="size-7 text-white fill-white/20 animate-pulse" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capsule Reveal Overlay Card */}
      <AnimatePresence>
        {activeCapsule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
            />

            {/* Capsule Reveal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              className={`relative z-10 w-full max-w-sm rounded-[2.2rem] bg-gradient-to-b from-stone-900 to-stone-950 border border-white/10 p-6 md:p-8 text-center shadow-2xl overflow-hidden`}
            >
              {/* Top gradient highlight based on capsule config */}
              <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${activeCapsule.color}`} />

              {/* Floating elements inside modal */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <Sparkles className="absolute left-8 top-12 size-4 text-white" />
                <Sparkles className="absolute right-12 top-24 size-6 text-white" />
                <Heart className="absolute left-10 bottom-16 size-5 text-white" />
              </div>

              {/* Floating capsule icon stamp */}
              <div className={`mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-gradient-to-br ${activeCapsule.color} text-4xl shadow-lg border border-white/20 animate-bounce`}>
                {activeCapsule.icon}
              </div>

              {/* Tag Label */}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 mb-3 text-stone-200`}>
                {activeCapsule.type === 'coupon' ? '🎫 Birthday Coupon' : '✨ Sacred Wish'}
              </span>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold text-white mb-3 leading-snug">
                {activeCapsule.title}
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed max-w-xs mx-auto italic">
                "{activeCapsule.text}"
              </p>

              {/* Claim / Back Button */}
              <button
                onClick={handleDismiss}
                type="button"
                className="mt-8 w-full rounded-xl bg-white text-stone-900 py-3 text-xs font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition cursor-pointer"
              >
                Accept and Put in Pocket
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
