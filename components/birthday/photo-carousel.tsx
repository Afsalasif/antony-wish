'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

// Unsplash backup images in case local files (/1.jpeg, etc.) are missing, so it looks premium immediately
const BACKUP_IMAGES = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600', // First Conversation (Couple)
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600', // Comfort in Silence (Cozy room/books)
  'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600', // Food/Fries Date
  'https://images.unsplash.com/photo-1484755560693-a4074577af3a?q=80&w=600', // Music playlist (vinyl/headphones)
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600', // Coffee in the Rain
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600', // Grocery Store
  'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=600', // Sunsets
]

export function PhotoCarousel({ onFinish }: { onFinish: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const total = CONFIG.memories.length

  const handleNext = () => {
    if (currentIndex < total - 1) {
      haptic('tap')
      setDirection('next')
      setCurrentIndex((prev) => prev + 1)
    } else {
      haptic('success')
      onFinish()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      haptic('tap')
      setDirection('prev')
      setCurrentIndex((prev) => prev - 1)
    }
  }

  // Animation variants for Polaroid slide
  const variants = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? 250 : -250,
      opacity: 0,
      scale: 0.9,
      rotate: dir === 'next' ? 6 : -6,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: currentIndex % 2 === 0 ? -1.5 : 1.5,
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? -250 : 250,
      opacity: 0,
      scale: 0.9,
      rotate: dir === 'next' ? -6 : 6,
    }),
  }

  const memory = CONFIG.memories[currentIndex]
  const backupImg = BACKUP_IMAGES[currentIndex % BACKUP_IMAGES.length]

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto select-none p-4 min-h-[65vh]">
      {/* Background card count/stacked look */}
      <div className="absolute inset-x-8 top-10 bottom-24 bg-stone-100/10 border border-white/5 rounded-2xl rotate-2 -z-10 pointer-events-none" />
      <div className="absolute inset-x-6 top-8 bottom-22 bg-stone-100/5 border border-white/5 rounded-2xl -rotate-3 -z-20 pointer-events-none" />

      {/* Polaroid Deck Container */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {memory && (
            <motion.div
              key={memory.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="absolute w-full h-full bg-stone-50 border-2 border-stone-250 p-4 pb-6 shadow-2xl rounded-xs text-stone-900 flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative w-full aspect-square bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center rounded-xs shadow-inner">
                {/* Try rendering local file first; if it falls back to default, display Unsplash */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.image && memory.image !== '' ? memory.image : backupImg}
                  alt={memory.title}
                  className="h-full w-full object-cover grayscale-[12%] hover:grayscale-0 transition duration-500"
                  onError={(e) => {
                    // Fail-safe fallback to Unsplash image
                    const target = e.target as HTMLImageElement
                    if (target.src !== backupImg) {
                      target.src = backupImg
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-stone-50/90 text-lg rounded-full size-8 flex items-center justify-center shadow-md border border-stone-200">
                  {memory.emoji}
                </div>
              </div>

              {/* Description Card Stamp inside Polaroid */}
              <div className="text-center font-serif mt-3 px-1 flex-1 flex flex-col justify-center">
                <span className="font-mono text-[9px] tracking-widest text-stone-400 block uppercase mb-1">
                  {memory.date}
                </span>
                <h3 className="text-stone-850 font-bold text-base leading-snug">
                  {memory.title}
                </h3>
                <p className="text-stone-600 font-sans text-[11px] leading-relaxed mt-1.5 italic">
                  "{memory.body}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="mt-8 flex items-center justify-between w-full px-4">
        {/* Back Button */}
        <button
          onClick={handlePrev}
          type="button"
          disabled={currentIndex === 0}
          className={`flex size-10 items-center justify-center rounded-full border shadow-sm transition active:scale-95 cursor-pointer ${
            currentIndex === 0
              ? 'border-white/5 bg-white/0 text-stone-600 opacity-30 cursor-not-allowed'
              : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'
          }`}
          aria-label="Previous image"
        >
          <ArrowLeft className="size-4" />
        </button>

        {/* Card indicator dots */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[10px] text-foreground/50 tracking-wider">
            {currentIndex + 1} of {total}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-foreground/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next/Finish Button */}
        <button
          onClick={handleNext}
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-900 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={currentIndex === total - 1 ? 'Go to cake blow' : 'Next image'}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Celebrate Banner Button for last card */}
      {currentIndex === total - 1 && (
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          type="button"
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 py-3.5 text-xs font-bold text-white shadow-xl flex items-center justify-center gap-2 border border-white/10 cursor-pointer animate-pulse"
        >
          <Sparkles className="size-3.5" />
          <span>Celebrate & Make a Wish, Koche 🍰</span>
        </motion.button>
      )}
    </div>
  )
}
