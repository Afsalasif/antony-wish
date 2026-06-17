'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Motion } from '@/lib/experiences'
import { haptic } from '@/lib/haptics'

export interface Reaction {
  motion: Motion
  nonce: number
}

interface Props {
  label: string
  reaction: Reaction
  noCount: number
  /** Fired whenever the user manages to press No (or a decoy). */
  onPress: () => void
}

interface Pos {
  x: number
  y: number
  scale: number
  rotate: number
}

const CENTER: Pos = { x: 0, y: 0, scale: 1, rotate: 0 }

function randomInBounds(b: { w: number; h: number }) {
  const padX = b.w * 0.32
  const padY = b.h * 0.34
  return {
    x: (Math.random() * 2 - 1) * padX,
    y: (Math.random() * 2 - 1) * padY,
  }
}

export function EvasiveNoButton({ label, reaction, noCount, onPress }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const boundsRef = useRef({ w: 320, h: 360 })

  const [pos, setPos] = useState<Pos>({ ...CENTER, y: 92 })
  const [visible, setVisible] = useState(true)
  const [frozen, setFrozen] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [decoys, setDecoys] = useState<{ id: number; x: number; y: number }[]>([])
  const [shards, setShards] = useState(false)

  // Measure the stage so motions stay on-screen.
  useEffect(() => {
    const measure = () => {
      const parent = wrapRef.current?.parentElement
      if (parent) boundsRef.current = { w: parent.clientWidth, h: parent.clientHeight }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // No pointer-dodging: the button is always tappable so she experiences
  // every escalating shenanigan. The playful motion happens AFTER each press.

  // React to each new "No" press by performing the assigned motion.
  useEffect(() => {
    if (reaction.nonce === 0) return
    const b = boundsRef.current
    const next = randomInBounds(b)

    switch (reaction.motion) {
      case 'shrink':
        setPos((p) => ({ ...p, ...next, scale: Math.max(0.45, p.scale * 0.82) }))
        break
      case 'teleport':
      case 'runaway':
        setPos((p) => ({ ...p, ...next, scale: Math.max(0.6, p.scale) }))
        break
      case 'spin':
        setPos((p) => ({ ...p, ...next, rotate: p.rotate + 540 }))
        break
      case 'balloon':
        setVisible(false)
        setPos((p) => ({ ...p, y: -b.h, rotate: p.rotate + 60 }))
        window.setTimeout(() => {
          setPos({ ...CENTER, ...randomInBounds(b) })
          setVisible(true)
        }, 900)
        break
      case 'dissolve':
        setVisible(false)
        window.setTimeout(() => {
          setPos({ ...CENTER, ...randomInBounds(b) })
          setVisible(true)
        }, 700)
        break
      case 'split': {
        const ds = Array.from({ length: 4 }, (_, i) => ({ id: i, ...randomInBounds(b) }))
        setDecoys(ds)
        window.setTimeout(() => setDecoys([]), 2600)
        setPos((p) => ({ ...p, ...next }))
        break
      }
      case 'puzzle':
        setShards(true)
        setVisible(false)
        window.setTimeout(() => {
          setShards(false)
          setPos({ ...CENTER, ...randomInBounds(b) })
          setVisible(true)
        }, 1100)
        break
      case 'unavailable':
        setFrozen(true)
        setCountdown(3)
        break
      case 'heavy':
        setPos((p) => ({ ...p, x: p.x + 0, y: p.y + 0, rotate: 0 }))
        break
      case 'relabel':
      case 'none':
      default:
        // gentle nudge so it always feels alive
        setPos((p) => ({ ...p, x: next.x * 0.5, y: next.y * 0.5 }))
        break
    }
  }, [reaction])

  // Countdown for the "unavailable" motion.
  useEffect(() => {
    if (countdown <= 0) return
    const t = window.setTimeout(() => {
      setCountdown((c) => {
        if (c <= 1) setFrozen(false)
        return c - 1
      })
    }, 900)
    return () => window.clearTimeout(t)
  }, [countdown])

  const press = useCallback(() => {
    if (frozen) {
      haptic('error')
      return
    }
    haptic('double')
    onPress()
  }, [frozen, onPress])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {/* Decoys */}
      <AnimatePresence>
        {decoys.map((d) => (
          <motion.button
            key={`decoy-${d.id}-${reaction.nonce}`}
            type="button"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2, rotate: 40 }}
            onClick={press}
            className="glass pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl px-6 py-3 text-base font-semibold text-foreground/80"
            style={{ x: d.x, y: d.y }}
            aria-label="No (decoy)"
          >
            {label}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Puzzle shards */}
      <AnimatePresence>
        {shards &&
          Array.from({ length: 9 }).map((_, i) => (
            <motion.span
              key={`shard-${i}`}
              className="absolute left-1/2 top-1/2 h-6 w-6 rounded-md bg-secondary"
              style={{ x: pos.x, y: pos.y }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                x: pos.x + (Math.random() * 240 - 120),
                y: pos.y + (Math.random() * 240 - 120),
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          ))}
      </AnimatePresence>

      {/* The real No button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            ref={btnRef}
            type="button"
            onClick={press}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: frozen ? 0.5 : 1,
              x: pos.x,
              y: pos.y,
              scale: pos.scale,
              rotate: pos.rotate,
            }}
            exit={{ opacity: 0, scale: 0.3, filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.6 }}
            whileTap={{ scale: pos.scale * 0.94 }}
            className="glass pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none rounded-2xl px-8 py-3.5 text-lg font-semibold text-foreground shadow-xl"
            style={{ willChange: 'transform' }}
            aria-label="No"
          >
            {frozen && countdown > 0 ? `Back in ${countdown}…` : label}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
