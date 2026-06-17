'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'

const BACKUP_IMAGES = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200',
  'https://images.unsplash.com/photo-1484755560693-a4074577af3a?q=80&w=1200',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200',
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200',
]

const LOADING_STATUSES = [
  'Preparing the stars...',
  'Assembling your wish...',
  'Baking the birthday cake...',
  'Lighting the candle...',
  'Ready! 🎂',
]

export function LoopingCarousel({ onComplete }: { onComplete: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [statusText, setStatusText] = useState(LOADING_STATUSES[0])

  const memories = CONFIG.memories
  const totalDuration = 11000 // 11 seconds timeout

  // Auto-loop image slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % memories.length)
    }, 2200) // Change image every 2.2 seconds

    return () => clearInterval(slideInterval)
  }, [memories.length])

  // Status text progression & auto-complete timeout
  useEffect(() => {
    const textInterval = setInterval(() => {
      setStatusText((current) => {
        const idx = LOADING_STATUSES.indexOf(current)
        if (idx < LOADING_STATUSES.length - 1) {
          return LOADING_STATUSES[idx + 1]
        }
        return current
      })
    }, totalDuration / LOADING_STATUSES.length)

    const completeTimeout = setTimeout(() => {
      onComplete()
    }, totalDuration)

    return () => {
      clearInterval(textInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  const activeMemory = memories[imgIndex]
  const activeBackup = BACKUP_IMAGES[imgIndex % BACKUP_IMAGES.length]

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col justify-between items-center px-6 py-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] select-none overflow-hidden z-20 text-center">
      
      {/* 1. BACKGROUND IMAGES (Mobile only - fullscreen cover) */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-background md:hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeMemory?.id || imgIndex}
            src={activeMemory?.image && activeMemory.image !== '' ? activeMemory.image : activeBackup}
            alt="Mobile Background Memory Slide"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[45%] saturate-[110%]"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== activeBackup) {
                target.src = activeBackup
              }
            }}
          />
        </AnimatePresence>

        {/* Ambient Dark Overlay Gradients for mobile title legibility */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* 2. RESPONSIVE DESKTOP LAYOUT (Split Screen for MD and up) */}
      <div className="relative z-10 w-full max-w-5xl h-full flex flex-col justify-between items-center md:flex-row md:items-center md:justify-around gap-6">
        
        {/* Left Side: Title & Loader (centered on mobile, left-aligned on desktop) */}
        <div className="flex flex-col justify-between md:justify-center items-center md:items-start h-full md:h-auto max-w-md md:text-left gap-8 md:gap-14 py-4 flex-1">
          
          {/* Header Title */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-sm md:max-w-md"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-glow tracking-tight flex items-center justify-center md:justify-start gap-2 leading-none">
              <Sparkles className="size-6 md:size-8 text-amber-300 animate-pulse shrink-0" />
              Happy Birthday, my Koche!
            </h1>
            <p className="text-sm md:text-lg text-white/75 mt-3.5 italic font-heading">
              Celebrating another beautiful year of your light.
            </p>
          </motion.div>

          {/* Bottom Loading Progress Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm space-y-3"
          >
            {/* Status updates text */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs md:text-sm text-white/80 font-bold tracking-wide">
              <Heart className="size-3 text-rose-500 fill-current animate-pulse shrink-0" />
              <span>{statusText}</span>
            </div>

            {/* Loading Progress Bar Container */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: totalDuration / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Polaroid Slideshow Frame (Tablet/Desktop Only, hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col w-full max-w-[320px] bg-stone-50 border-2 border-stone-250 p-4 pb-6 shadow-2xl rounded-xs text-stone-900 aspect-[4/5] justify-between relative transform rotate-1"
          style={{ rotate: imgIndex % 2 === 0 ? '-1.5deg' : '1.5deg' }}
        >
          {/* Photo Frame Container */}
          <div className="relative w-full aspect-square bg-stone-100 border border-stone-200 overflow-hidden rounded-xs flex items-center justify-center shadow-inner">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeMemory?.id || imgIndex}
                src={activeMemory?.image && activeMemory.image !== '' ? activeMemory.image : activeBackup}
                alt="Desktop Slideshow Memory Card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src !== activeBackup) {
                    target.src = activeBackup
                  }
                }}
              />
            </AnimatePresence>
            {activeMemory && (
              <div className="absolute bottom-2 right-2 bg-stone-50/90 text-lg rounded-full size-8 flex items-center justify-center shadow-md border border-stone-200 z-10">
                {activeMemory.emoji}
              </div>
            )}
          </div>
          {/* Polaroid label stamp */}
          <div className="text-center mt-3 text-lg leading-none tracking-widest select-none">
            ✨💖✨
          </div>
        </motion.div>

      </div>
    </div>
  )
}
