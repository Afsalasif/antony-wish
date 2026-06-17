'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

/**
 * Cinematic, depth-layered background: animated gradient blooms, drifting
 * particles, and a subtle device-tilt parallax. Intensity ramps with `level`.
 */
export function AmbientBackground({
  level = 0,
  warm = false,
}: {
  level?: number
  warm?: boolean
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      const x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45))
      const y = Math.max(-1, Math.min(1, (e.beta ?? 0) / 45))
      setTilt({ x, y })
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [])

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        size: 6 + Math.random() * 16,
        heart: i % 4 === 0,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Gradient blooms */}
      <motion.div
        aria-hidden
        className="absolute -left-1/4 -top-1/4 h-[80vmax] w-[80vmax] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in oklab, var(--primary) 55%, transparent), transparent 60%)',
          x: tilt.x * 30,
          y: tilt.y * 30,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-1/4 bottom-[-20%] h-[70vmax] w-[70vmax] rounded-full blur-3xl"
        style={{
          background: warm
            ? 'radial-gradient(circle at center, color-mix(in oklab, var(--gold) 60%, transparent), transparent 60%)'
            : 'radial-gradient(circle at center, color-mix(in oklab, var(--chart-3) 50%, transparent), transparent 60%)',
          x: tilt.x * -40,
          y: tilt.y * -40,
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Extra ambient bloom that intensifies with level */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[50vmax] w-[50vmax] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in oklab, var(--gold) 45%, transparent), transparent 65%)',
          opacity: Math.min(0.05 + level * 0.06, 0.4),
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Drifting particles (client-only to avoid hydration mismatch) */}
      {mounted &&
        particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 block rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.heart
              ? 'transparent'
              : 'color-mix(in oklab, var(--gold) 70%, transparent)',
            boxShadow: p.heart ? 'none' : '0 0 12px color-mix(in oklab, var(--gold) 60%, transparent)',
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.heart ? (
            <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="currentColor" className="text-primary">
              <path d="M12 21s-6.7-4.35-9.33-8.07C.9 10.27 1.5 7 4.2 5.7c1.9-.9 3.95-.2 5 1.06.05.06.1.13.6.74.5-.61.55-.68.6-.74 1.05-1.26 3.1-1.96 5-1.06 2.7 1.3 3.3 4.57 1.53 7.23C18.7 16.65 12 21 12 21z" />
            </svg>
            ) : null}
          </span>
        ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 55%, color-mix(in oklab, var(--background) 90%, black) 100%)',
        }}
      />
    </div>
  )
}
