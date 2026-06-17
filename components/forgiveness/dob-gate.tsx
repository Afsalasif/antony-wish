'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Heart, ShieldAlert } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function DobGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [shake, setShake] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form states
  const [herMonth, setHerMonth] = useState('1')
  const [herDay, setHerDay] = useState('1')
  const [herYear, setHerYear] = useState('2001')

  const [hisMonth, setHisMonth] = useState('1')
  const [hisDay, setHisDay] = useState('1')
  const [hisYear, setHisYear] = useState('2000')

  useEffect(() => {
    // Check if previously unlocked
    const status = localStorage.getItem('forgive-gate:unlocked')
    if (status === 'true') {
      setUnlocked(true)
    }
    setHydrated(true)
  }, [])

  const handleUnlock = () => {
    const isHerCorrect = 
      parseInt(herMonth) === CONFIG.recipientDob.month &&
      parseInt(herDay) === CONFIG.recipientDob.day &&
      parseInt(herYear) === CONFIG.recipientDob.year

    const isHisCorrect = 
      parseInt(hisMonth) === CONFIG.senderDob.month &&
      parseInt(hisDay) === CONFIG.senderDob.day &&
      parseInt(hisYear) === CONFIG.senderDob.year

    if (isHerCorrect && isHisCorrect) {
      haptic('success')
      localStorage.setItem('forgive-gate:unlocked', 'true')
      localStorage.removeItem('forgive-me:v1') // Clear old progress so she starts fresh!
      setUnlocked(true)
    } else {
      haptic('error')
      setShake(true)
      setErrorMsg('Hmm... that combination did not unlock the heart. Try again, love. 🔐')
      window.setTimeout(() => setShake(false), 600)
    }
  }

  // Generate range lists
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const years = Array.from({ length: 25 }, (_, i) => 1990 + i)

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground">
        <Heart className="size-10 text-primary animate-pulse" />
      </div>
    )
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 overflow-y-auto">
      {/* warm ambient glow */}
      <div className="absolute inset-0 -z-10 bg-radial from-primary/10 via-transparent to-transparent opacity-80" />

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md rounded-[2.2rem] p-7 md:p-8 border border-foreground/5 shadow-2xl relative"
      >
        {/* Header Icon */}
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-inner">
          <Lock className="size-6" />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            A Tiny Bit of Privacy
          </h2>
          <p className="text-xs text-foreground/60 mt-1 max-w-[280px] mx-auto">
            To open this letter, verify our dates of birth to make sure it's really you.
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="space-y-5">
          {/* Her Birthday Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <span>🌸</span> Her Date of Birth ({CONFIG.recipientName})
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={herMonth}
                onChange={(e) => setHerMonth(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
              <select
                value={herDay}
                onChange={(e) => setHerDay(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={herYear}
                onChange={(e) => setHerYear(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* His Birthday Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-gold flex items-center gap-1.5">
              <span>⚡</span> My Date of Birth ({CONFIG.senderName})
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={hisMonth}
                onChange={(e) => setHisMonth(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
              <select
                value={hisDay}
                onChange={(e) => setHisDay(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={hisYear}
                onChange={(e) => setHisYear(e.target.value)}
                className="rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 flex gap-2.5 text-xs text-destructive-foreground"
            >
              <ShieldAlert className="size-4 shrink-0 mt-0.5 text-destructive" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={handleUnlock}
          type="button"
          className="mt-6 w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Heart className="size-4 fill-current animate-pulse" />
          <span>Unlock Heart</span>
        </button>
      </motion.div>
    </div>
  )
}
