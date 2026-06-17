'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkles, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import type { Experience } from '@/lib/experiences'
import { Typewriter } from './typewriter'

interface Props {
  experience: Experience | null
  onDismiss: () => void
}

/** Transient overlays that vary by the active experience. */
export function ExperienceOverlay({ experience, onDismiss }: Props) {
  const overlay = experience?.overlay ?? 'none'
  const isToast = overlay === 'toast' || overlay === 'excuse'
  const isCard = overlay === 'story' || overlay === 'stats' || overlay === 'protocol' || overlay === 'crash' || overlay === 'poem'

  // Toasts auto-dismiss; caption-only and motion-only do nothing here.
  useEffect(() => {
    if (!experience) return
    if (isToast) {
      const t = window.setTimeout(onDismiss, 2600)
      return () => window.clearTimeout(t)
    }
  }, [experience, isToast, onDismiss])

  return (
    <AnimatePresence mode="wait">
      {experience && isToast && (
        <motion.div
          key={experience.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="glass pointer-events-none fixed inset-x-4 top-[calc(env(safe-area-inset-top)+1rem)] z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-pretty"
          role="status"
        >
          <Sparkles className="size-5 shrink-0 text-gold" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/90">{experience.body}</p>
        </motion.div>
      )}

      {experience && isCard && (
        <motion.div
          key={experience.id}
          className="fixed inset-0 z-40 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* scrim */}
          <motion.button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="absolute inset-0 bg-background/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="glass relative z-10 w-full max-w-md rounded-[1.6rem] p-7 text-center shadow-2xl"
            style={{ perspective: 1000 }}
          >
            {overlay === 'crash' && (
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <TriangleAlert className="size-6" aria-hidden />
              </div>
            )}

            {overlay === 'stats' && experience.stat && (
              <>
                <p className="font-heading text-6xl font-bold text-gold text-glow">
                  {experience.stat.value}
                </p>
                <p className="mt-3 text-pretty text-base leading-relaxed text-foreground/80">
                  {experience.stat.label}
                </p>
              </>
            )}

            {overlay === 'story' && (
              <div className="relative mx-auto max-w-xs bg-stone-50 border border-stone-200/60 p-4 pb-6 shadow-2xl rounded-xs text-stone-900 select-none rotate-[-1deg]">
                {/* Washi tape effect */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 bg-amber-100/35 border border-amber-200/20 backdrop-blur-xs select-none pointer-events-none rotate-2 z-20 shadow-xs" />
                
                {/* Image placeholder or emoji */}
                <div className="relative aspect-square w-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center rounded-xs shadow-inner">
                  {experience.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={experience.image} 
                      alt={experience.title} 
                      className="h-full w-full object-cover grayscale-[20%] contrast-[105%]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-stone-400">
                      <span className="text-6xl mb-2">{experience.emoji ?? '📸'}</span>
                    </div>
                  )}
                  {experience.emoji && experience.image && (
                    <div className="absolute bottom-2 right-2 bg-stone-50/90 backdrop-blur-xs size-8 rounded-full flex items-center justify-center text-lg shadow-sm border border-stone-100">
                      {experience.emoji}
                    </div>
                  )}
                </div>

                {/* Polaroid content */}
                <div className="mt-4 text-center">
                  {experience.date && (
                    <span className="font-mono text-[10px] tracking-widest text-stone-400 uppercase block mb-1">
                      {experience.date}
                    </span>
                  )}
                  <p className="mt-2 text-stone-600 text-xs leading-relaxed min-h-[3rem] px-1 font-sans">
                    <Typewriter text={experience.body ?? ''} />
                  </p>
                </div>
              </div>
            )}

            {overlay === 'poem' && experience.stanzas && (
              <div className="relative mx-auto max-w-sm text-stone-900 border border-stone-200 bg-[#fdfbf7] p-6 pb-8 shadow-2xl rounded-lg font-serif">
                {/* Vintage leaf decoration */}
                <div className="mx-auto mb-4 flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm select-none">
                  <Heart className="size-4 fill-current animate-pulse" />
                </div>
                
                <h2 className="text-xl font-bold italic text-stone-850 leading-tight text-center border-b border-stone-200/50 pb-2 mb-5">
                  {experience.title}
                </h2>
                
                <div className="space-y-5 text-center select-text max-h-[40vh] overflow-y-auto pr-1">
                  {experience.stanzas.map((stanza, idx) => (
                    <p key={idx} className="text-stone-700 text-[13px] leading-relaxed italic whitespace-pre-line">
                      {stanza}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {(overlay === 'protocol' || overlay === 'crash') && (
              <>
                {experience.title && (
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {experience.title}
                  </h2>
                )}
                <p className="mt-2 min-h-[3rem] text-pretty text-lg leading-relaxed text-foreground/85">
                  <Typewriter text={experience.body ?? ''} />
                </p>
              </>
            )}

            <button
              type="button"
              onClick={onDismiss}
              className="mt-7 w-full rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.98]"
            >
              {overlay === 'protocol' ? 'I’m listening…' : 'Okay, go on'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
