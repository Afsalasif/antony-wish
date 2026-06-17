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
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col justify-between items-center px-6 py-[calc(env(safe-area-inset-top)+2.5rem)] pb-[calc(env(safe-area-inset-bottom)+2.5rem)] select-none overflow-hidden z-20 text-center">
      
      {/* 1. Full Screen Cover Image Carousel Background */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeMemory?.id || imgIndex}
            src={activeMemory?.image && activeMemory.image !== '' ? activeMemory.image : activeBackup}
            alt="Background Slide"
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

        {/* Ambient Dark Overlay Gradients to maximize legibility */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* 2. Top Header Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 max-w-sm mt-4"
      >
        <h1 className="font-heading text-4xl font-extrabold text-white text-glow tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="size-6 text-amber-300 animate-pulse" />
          Happy Birthday, Koche!
        </h1>
        <p className="text-sm text-white/75 mt-2 italic font-heading">
          Celebrating another beautiful year of your light.
        </p>
      </motion.div>

      {/* 3. Empty Center spacing to keep background photo clean */}
      <div className="flex-1" />

      {/* 4. Bottom Loading Indicators */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[280px] space-y-3 z-10 mb-4"
      >
        {/* Loading status text */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-white/80 font-bold tracking-wide">
          <Heart className="size-3 text-rose-500 fill-current animate-pulse" />
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
  )
}
