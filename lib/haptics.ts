'use client'

type Pattern = 'tap' | 'soft' | 'double' | 'success' | 'error'

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 12,
  soft: 8,
  double: [10, 40, 10],
  success: [12, 30, 12, 30, 60],
  error: [30, 20, 30],
}

/** Best-effort haptic feedback. Silently no-ops where unsupported. */
export function haptic(pattern: Pattern = 'tap') {
  if (typeof navigator === 'undefined') return
  try {
    navigator.vibrate?.(PATTERNS[pattern])
  } catch {
    /* ignore */
  }
}
