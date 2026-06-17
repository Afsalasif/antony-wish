'use client'

import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Volume2, VolumeX, FileText, Flower, BarChart2, BookOpen, Image as ImageIcon, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { haptic } from '@/lib/haptics'
import { startMusic, stopMusic } from '@/lib/music'
import { CONFIG, type MemoryItem } from '@/lib/personalized-config'
import { LoveLetterEnvelope } from './love-letter-envelope'
import { FlowerBouquetBuilder } from './flower-bouquet'

function burst() {
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({
      origin: { y: 0.6 },
      colors: ['#ff6b8a', '#ffd479', '#ff97b0', '#ffe8b0', '#ff4d6d'],
      ...opts,
      particleCount: Math.floor(220 * ratio),
    })
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

type Tab = 'letter' | 'bouquet' | 'poetry' | 'gallery' | 'stats'

export function YesCelebration({ onReset }: { onReset: () => void }) {
  const [muted, setMuted] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('letter')
  const [showContent, setShowContent] = useState(false)
  const [zoomMemory, setZoomMemory] = useState<MemoryItem | null>(null)
  
  const intervalRef = useRef<number | null>(null)

  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 6,
        size: 14 + Math.random() * 26,
      })),
    [],
  )

  useEffect(() => {
    haptic('success')
    burst()
    startMusic()
    // celebratory confetti rolls for a few seconds
    let shots = 0
    intervalRef.current = window.setInterval(() => {
      shots++
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#ff6b8a', '#ffd479', '#ff97b0'],
      })
      if (shots > 8 && intervalRef.current) window.clearInterval(intervalRef.current)
    }, 700)

    const contentT = window.setTimeout(() => setShowContent(true), 1100)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      window.clearTimeout(contentT)
      stopMusic()
    }
  }, [])

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m
      if (next) stopMusic()
      else startMusic()
      return next
    })
  }

  const handleTabChange = (tab: Tab) => {
    haptic('tap')
    setActiveTab(tab)
  }

  const handleOpenZoom = (m: MemoryItem) => {
    haptic('double')
    setZoomMemory(m)
  }

  const handleCloseZoom = () => {
    haptic('tap')
    setZoomMemory(null)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto overflow-x-hidden px-5 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* warm romantic wash */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--primary) 45%, var(--background)), var(--background) 70%)',
        }}
      />

      {/* floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute bottom-0 text-primary opacity-65"
            style={{
              left: `${h.left}%`,
              animation: `float-up ${h.duration}s linear ${h.delay}s infinite`,
            }}
          >
            <Heart className="fill-current" style={{ width: h.size, height: h.size }} aria-hidden />
          </span>
        ))}
      </div>

      {/* mute toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className="glass fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-50 flex size-11 items-center justify-center rounded-full text-foreground shadow-lg active:scale-95 transition"
        aria-label={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
      </button>

      {/* Header section */}
      <div className="w-full max-w-md text-center mt-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="flex flex-col items-center"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-3 shadow-md">
            <Heart className="size-7 fill-current animate-pulse" />
          </div>
          <h1 className="text-balance font-heading text-3xl font-bold text-foreground text-glow sm:text-4xl">
            {CONFIG.recipientName} said yes! 💖
          </h1>
          <p className="text-xs text-foreground/60 mt-1 max-w-[280px]">
            Thank you for giving me another chance. Explore our spaces below.
          </p>
        </motion.div>
      </div>

      {/* Interactive Tabs Menu - Horizontal Grid to fit 5 tabs on mobile */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-5 w-full max-w-md gap-1 rounded-2xl bg-foreground/[0.03] p-1.5 backdrop-blur-md border border-foreground/5 shadow-md relative z-20"
          >
            {(['letter', 'bouquet', 'poetry', 'gallery', 'stats'] as Tab[]).map((tab) => {
              const isActive = activeTab === tab
              const labels: Record<Tab, { text: string; icon: any }> = {
                letter: { text: 'Letter', icon: FileText },
                bouquet: { text: 'Flora', icon: Flower },
                poetry: { text: 'Poems', icon: BookOpen },
                gallery: { text: 'Memory', icon: ImageIcon },
                stats: { text: 'Stats', icon: BarChart2 },
              }
              const Icon = labels[tab].icon

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`relative flex flex-col md:flex-row items-center justify-center gap-1 py-2 rounded-xl text-[10px] md:text-xs font-semibold select-none transition-colors duration-300 ${
                    isActive ? 'text-primary-foreground' : 'text-foreground/75 hover:text-foreground hover:bg-foreground/[0.02]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-background"
                      className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon className="size-3.5" />
                  <span className="hidden xs:inline">{labels[tab].text}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Container */}
      <div className="mt-6 w-full max-w-md flex-1 flex flex-col justify-start relative z-10">
        <AnimatePresence mode="wait">
          {showContent && activeTab === 'letter' && (
            <motion.div
              key="tab-letter"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LoveLetterEnvelope />
            </motion.div>
          )}

          {showContent && activeTab === 'bouquet' && (
            <motion.div
              key="tab-bouquet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-secondary/15 backdrop-blur-md border border-foreground/5 rounded-[2rem] p-6 shadow-xl"
            >
              <FlowerBouquetBuilder />
            </motion.div>
          )}

          {showContent && activeTab === 'poetry' && (
            <motion.div
              key="tab-poetry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6"
            >
              {CONFIG.poems.map((poem, i) => (
                <div
                  key={i}
                  className="bg-[#fdfbf7] border border-stone-200 shadow-xl rounded-2xl p-6 md:p-8 text-stone-900 font-serif"
                >
                  <div className="flex justify-center mb-3">
                    <Heart className="size-5 text-primary/70 fill-primary/10" />
                  </div>
                  <h3 className="text-xl font-bold italic text-stone-850 text-center border-b border-stone-200/50 pb-2 mb-4">
                    {poem.title}
                  </h3>
                  <div className="space-y-4 text-center">
                    {poem.stanzas.map((stanza, idx) => (
                      <p key={idx} className="text-stone-700 text-sm leading-relaxed italic whitespace-pre-line">
                        {stanza}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {showContent && activeTab === 'gallery' && (
            <motion.div
              key="tab-gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-secondary/15 backdrop-blur-md border border-foreground/5 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="text-center mb-5">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Our Memory Lane
                </h3>
                <p className="text-xs text-foreground/60 mt-1">
                  Click on any Polaroid to zoom in and read the story
                </p>
              </div>

              {/* Grid of Polaroid thumbnails */}
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {CONFIG.memories.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? -1 : 1 }}
                    onClick={() => handleOpenZoom(m)}
                    className="cursor-pointer bg-stone-50 border border-stone-200/60 p-2.5 pb-4 shadow-md rounded-xs text-stone-950 select-none rotate-1"
                    style={{ rotate: idx % 2 === 0 ? '1.5deg' : '-1.5deg' }}
                  >
                    {/* Small square image */}
                    <div className="aspect-square w-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center rounded-xs relative">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={m.image} 
                          alt={m.title} 
                          className="h-full w-full object-cover grayscale-[10%]"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-3xl">{m.emoji}</span>
                      )}
                      {m.image && (
                        <div className="absolute bottom-1 right-1 bg-stone-50/90 text-xs rounded-full size-6 flex items-center justify-center shadow-xs">
                          {m.emoji}
                        </div>
                      )}
                    </div>
                    {/* Thumbnail caption */}
                    <div className="mt-2 text-center">
                      <span className="font-mono text-[7px] tracking-wider text-stone-400 block uppercase">
                        {m.date}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {showContent && activeTab === 'stats' && (
            <motion.div
              key="tab-stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-secondary/15 backdrop-blur-md border border-foreground/5 rounded-[2rem] p-6 shadow-xl space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Our Journey of Love
                </h3>
                <p className="text-xs text-foreground/60 mt-1">
                  Little reminders of what we built together
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {CONFIG.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="font-heading text-4xl font-extrabold text-gold text-glow select-none">
                      {stat.value}
                    </div>
                    <div className="text-xs text-foreground/80 font-medium leading-relaxed">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Detailed Memory Zoom View */}
      <AnimatePresence>
        {zoomMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseZoom}
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative z-10 w-full max-w-sm bg-stone-50 border border-stone-200/60 p-5 pb-7 shadow-2xl rounded-xs text-stone-900 select-none rotate-1"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseZoom}
                type="button"
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 shadow-sm border border-stone-300/40 z-30 transition"
              >
                <X className="size-4" />
              </button>

              {/* Polaroid Frame */}
              <div className="relative aspect-square w-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center rounded-xs shadow-inner mb-4">
                {zoomMemory.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={zoomMemory.image} 
                    alt={zoomMemory.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">{zoomMemory.emoji}</span>
                )}
                {zoomMemory.image && (
                  <div className="absolute bottom-2.5 right-2.5 bg-stone-50/90 text-xl rounded-full size-9 flex items-center justify-center shadow-md">
                    {zoomMemory.emoji}
                  </div>
                )}
              </div>

              <div className="text-center font-serif">
                <span className="font-mono text-[10px] tracking-widest text-stone-400 block uppercase mb-1">
                  {zoomMemory.date}
                </span>
                <p className="text-stone-600 text-xs leading-relaxed mt-3 px-1 font-sans">
                  {zoomMemory.body}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Reset button */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 mb-6 text-center z-10"
        >
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-foreground/45 hover:text-foreground/80 underline underline-offset-4 transition"
          >
            replay from the beginning
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
