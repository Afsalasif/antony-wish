'use client'

import { useEffect, useState } from 'react'

export function Typewriter({
  text,
  speed = 32,
  className,
  onDone,
}: {
  text: string
  speed?: number
  className?: string
  onDone?: () => void
}) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    let i = 0
    const id = window.setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
        onDone?.()
      }
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed, onDone])

  return (
    <span className={className}>
      {shown}
      <span className="ml-0.5 inline-block w-px animate-pulse">|</span>
    </span>
  )
}
