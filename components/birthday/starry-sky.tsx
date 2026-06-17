'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { startAmbientMusic, stopAmbientMusic, playStardustChime } from '@/lib/birthday-music'
import { haptic } from '@/lib/haptics'

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  twinkleSpeed: number
  driftSpeed: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

export function StarrySky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [muted, setMuted] = useState(true)

  const starsRef = useRef<Star[]>([])
  const particlesRef = useRef<Particle[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const animationFrameIdRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      stopAmbientMusic()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 9000)
      const stars: Star[] = []
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          driftSpeed: Math.random() * 0.04 + 0.01,
        })
      }
      starsRef.current = stars
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const render = () => {
      // 1. Clear Canvas (keep transparent to let CSS orbs show through)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 2. Draw Twinkling Stars
      starsRef.current.forEach((star) => {
        star.alpha += star.twinkleSpeed
        if (star.alpha > 1 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed
        }
        star.y -= star.driftSpeed
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, Math.min(star.alpha, 1))})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Draw Click Ripples
      ripplesRef.current.forEach((ripple, idx) => {
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.08
        ripple.alpha -= 0.02

        if (ripple.alpha <= 0) {
          ripplesRef.current.splice(idx, 1)
          return
        }

        ctx.strokeStyle = `rgba(251, 191, 36, ${ripple.alpha})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()
      })

      // 4. Draw Click Starburst Particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.02
        p.alpha -= 0.015
        p.life -= 1

        if (p.alpha <= 0 || p.life <= 0) {
          particlesRef.current.splice(idx, 1)
          return
        }

        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color.replace('1)', `${p.alpha})`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    haptic('tap')

    const yRatio = y / rect.height
    playStardustChime(yRatio)

    if (muted) {
      setMuted(false)
      startAmbientMusic()
    }

    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 60 + Math.random() * 40,
      alpha: 0.8,
    })

    const colors = [
      'rgba(251, 191, 36, 1)',
      'rgba(244, 63, 94, 1)',
      'rgba(168, 85, 247, 1)',
      'rgba(14, 165, 233, 1)',
    ]

    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 2 + 1
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 2.5 + 1.5,
        alpha: 0.9,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 50 + Math.random() * 30,
      })
    }
  }

  const toggleMuted = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic('success')
    const nextMuted = !muted
    setMuted(nextMuted)
    if (!nextMuted) {
      startAmbientMusic()
    } else {
      stopAmbientMusic()
    }
  }

  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden select-none bg-[#09030d]">
      
      {/* Beautiful Animated Subtle Pastel Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        {/* Soft Pink Orb */}
        <div 
          className="absolute -top-[15%] -left-[15%] w-[80%] h-[70%] rounded-full bg-rose-500/15 blur-[120px] animate-pulse" 
          style={{ animationDuration: '9s' }} 
        />
        {/* Soft Indigo/Purple Orb */}
        <div 
          className="absolute top-[35%] -right-[15%] w-[80%] h-[80%] rounded-full bg-purple-600/12 blur-[130px] animate-pulse" 
          style={{ animationDuration: '14s' }} 
        />
        {/* Soft Gold/Amber Orb */}
        <div 
          className="absolute -bottom-[20%] left-[15%] w-[70%] h-[70%] rounded-full bg-amber-400/8 blur-[110px] animate-pulse" 
          style={{ animationDuration: '11s' }} 
        />
      </div>

      {/* Twinkling star particle canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-pointer touch-none bg-transparent"
      />

      {/* Music mute controller */}
      <button
        onClick={toggleMuted}
        type="button"
        className="glass fixed right-5 top-[calc(env(safe-area-inset-top)+1rem)] z-50 flex size-11 items-center justify-center rounded-full text-foreground shadow-lg active:scale-95 transition cursor-pointer"
        aria-label={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5 animate-pulse" />}
      </button>
    </div>
  )
}
