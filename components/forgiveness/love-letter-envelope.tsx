'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

export function LoveLetterEnvelope() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenedFully, setIsOpenedFully] = useState(false)

  const handleOpen = () => {
    if (isOpen) return
    haptic('success')
    setIsOpen(true)
    // Delay setting full open status to allow slide out animation to play
    window.setTimeout(() => {
      setIsOpenedFully(true)
      haptic('double')
    }, 1200)
  }

  const handleClose = () => {
    haptic('tap')
    setIsOpenedFully(false)
    setIsOpen(false)
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center py-6">
      <AnimatePresence mode="wait">
        {!isOpenedFully ? (
          /* Closed/Opening Envelope State */
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={handleOpen}
            className="group relative h-56 w-full max-w-sm cursor-pointer rounded-2xl bg-secondary/30 border border-foreground/10 shadow-2xl transition duration-500 hover:shadow-primary/10 overflow-hidden"
            style={{ perspective: 1000 }}
          >
            {/* Ambient gold glow around the seal */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-gold/5 to-transparent pointer-events-none" />

            {/* Back face of envelope (inner pocket) */}
            <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 shadow-inner" />

            {/* Letter peek (slides slightly out on hover) */}
            <motion.div 
              className="absolute left-6 right-6 top-6 h-28 rounded-t-lg bg-stone-50 p-4 shadow-sm border border-stone-200/50"
              animate={isOpen ? { y: -50, scale: 0.95 } : { y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <div className="h-2 w-1/3 rounded bg-stone-200" />
              <div className="h-1.5 w-full rounded bg-stone-100 mt-3" />
              <div className="h-1.5 w-4/5 rounded bg-stone-100 mt-2" />
            </motion.div>

            {/* Envelope flap - top triangle (rotates up on open) */}
            <motion.div 
              className="absolute inset-x-0 top-0 h-28 origin-top bg-stone-200 dark:bg-stone-850 shadow-md"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                transformOrigin: 'top center'
              }}
              animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />

            {/* Envelope pocket triangles - left & right sides overlay */}
            <div 
              className="absolute inset-0 pointer-events-none bg-stone-100/90 dark:bg-stone-900/95"
              style={{
                clipPath: 'polygon(0 100%, 0 0, 50% 60%, 100% 0, 100% 100%)',
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-200/50 to-transparent dark:from-stone-950/50"
              style={{
                clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)',
              }}
            />

            {/* Wax Seal */}
            {!isOpen && (
              <motion.div 
                className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              >
                <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-800 shadow-lg border-2 border-rose-500/30">
                  <div className="absolute inset-1 rounded-full border border-dashed border-white/20" />
                  <Heart className="size-6 text-white fill-white animate-pulse" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500/80 mt-2 filter drop-shadow-sm">
                  Break Seal to Open
                </span>
              </motion.div>
            )}

            {/* Custom sparkles overlaying during open */}
            {isOpen && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="size-10 text-gold animate-ping opacity-60" />
              </div>
            )}
          </motion.div>
        ) : (
          /* Opened Handwritten Letter State */
          <motion.div
            key="letter-opened"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="w-full max-w-md relative"
          >
            {/* Stationery background with deckled shadows */}
            <div className="relative rounded-[2rem] border border-orange-100/50 bg-gradient-to-b from-[#fdfbf7] to-[#f5f0e6] p-8 shadow-2xl text-stone-800 dark:text-stone-900 border-b-[6px] border-b-amber-200/50">
              
              {/* Top vintage-style headers */}
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 mb-6">
                <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                  From: {CONFIG.senderName}
                </div>
                <div className="flex gap-1">
                  <span className="size-2 rounded-full bg-rose-300" />
                  <span className="size-2 rounded-full bg-amber-300" />
                  <span className="size-2 rounded-full bg-emerald-300" />
                </div>
              </div>

              {/* Letter content in nice font */}
              <div className="space-y-4">
                <p className="font-serif text-2xl italic font-semibold text-stone-900">
                  {CONFIG.loveLetter.salutation}
                </p>

                {CONFIG.loveLetter.paragraphs.map((p, i) => (
                  <p 
                    key={i} 
                    className="font-sans text-stone-700 leading-relaxed text-pretty text-[15px]"
                  >
                    {p}
                  </p>
                ))}

                <div className="pt-6 border-t border-stone-200/40">
                  <p className="font-serif text-stone-500 text-sm italic">
                    {CONFIG.loveLetter.closing}
                  </p>
                  <p className="font-serif text-2xl italic font-bold text-primary mt-1">
                    {CONFIG.loveLetter.signature}
                  </p>
                </div>
              </div>

              {/* Decorative bottom stamp */}
              <div className="absolute right-8 bottom-6 opacity-30 select-none pointer-events-none">
                <Heart className="size-16 text-rose-500 fill-rose-500/10" />
              </div>
            </div>

            {/* Close / Fold Back Button */}
            <button
              onClick={handleClose}
              type="button"
              className="mx-auto mt-6 flex rounded-full bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-900 px-6 py-2.5 text-xs font-semibold shadow-lg hover:shadow-xl transition active:scale-95 items-center gap-1.5"
            >
              Fold and close letter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
