'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type Experience, pickExperience } from './experiences'

const STORAGE_KEY = 'forgive-me:v1'

interface Memory {
  noCount: number
  seen: string[]
  secondsSpent: number
  interactions: number
  forgiven: boolean
}

const EMPTY: Memory = {
  noCount: 0,
  seen: [],
  secondsSpent: 0,
  interactions: 0,
  forgiven: false,
}

function load(): Memory {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Memory>) }
  } catch {
    return EMPTY
  }
}

export function useForgiveness() {
  const [memory, setMemory] = useState<Memory>(EMPTY)
  const [hydrated, setHydrated] = useState(false)
  const memRef = useRef<Memory>(EMPTY)

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const m = load()
    memRef.current = m
    setMemory(m)
    setHydrated(true)
  }, [])

  const persist = useCallback((next: Memory) => {
    memRef.current = next
    setMemory(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  // Track time spent on the page (every 5s, while not yet forgiven).
  useEffect(() => {
    if (!hydrated) return
    const t = setInterval(() => {
      const m = memRef.current
      if (m.forgiven) return
      persist({ ...m, secondsSpent: m.secondsSpent + 5 })
    }, 5000)
    return () => clearInterval(t)
  }, [hydrated, persist])

  /** Register a "No" press and return the next unique experience. */
  const pressNo = useCallback((): Experience => {
    const m = memRef.current
    const attempt = m.noCount + 1
    const exp = pickExperience(attempt, m.seen)
    persist({
      ...m,
      noCount: attempt,
      seen: [...m.seen, exp.id],
    })
    return exp
  }, [persist])

  const completeInteraction = useCallback(() => {
    const m = memRef.current
    persist({ ...m, interactions: m.interactions + 1 })
  }, [persist])

  const forgive = useCallback(() => {
    const m = memRef.current
    persist({ ...m, forgiven: true })
  }, [persist])

  const reset = useCallback(() => {
    persist({ ...EMPTY })
  }, [persist])

  return {
    hydrated,
    noCount: memory.noCount,
    seenCount: memory.seen.length,
    secondsSpent: memory.secondsSpent,
    interactions: memory.interactions,
    forgiven: memory.forgiven,
    pressNo,
    completeInteraction,
    forgive,
    reset,
  }
}
