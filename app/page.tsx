'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { haptic } from '@/lib/haptics'
import { StarrySky } from '@/components/birthday/starry-sky'
import { LoopingCarousel } from '@/components/birthday/looping-carousel'
import { BirthdayCake } from '@/components/birthday/birthday-cake'

type Phase = 'intro' | 'main'

export default function Page() {
  const [phase, setPhase] = useState<Phase>('intro')

  const handleEnterCake = () => {
    haptic('success')
    setPhase('main')
  }

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden text-foreground">
      {/* 1. Global interactive Canvas Background & Music Controller */}
      <StarrySky />

      <AnimatePresence mode="wait">
        {/* ---------------------------- LOOPING CAROUSEL INTRO ---------------------------- */}
        {phase === 'intro' && (
          <motion.section
            key="intro"
            className="flex flex-1 flex-col items-center justify-center px-6 z-10"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <LoopingCarousel onComplete={handleEnterCake} />
          </motion.section>
        )}

        {/* ----------------------------- CAKE SCREEN ----------------------------- */}
        {phase === 'main' && (
          <motion.section
            key="main"
            className="flex flex-1 flex-col z-10 w-full h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
            }}
          >
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-center no-scrollbar relative z-10">
              <BirthdayCake />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
