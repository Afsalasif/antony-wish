// The brain of the experience. Produces a deep library of unique "NO" reactions
// and guarantees the same one is never shown twice (combining when exhausted).

import { CONFIG } from './personalized-config'

export type Stage =
  | 'cute'
  | 'funny'
  | 'personal'
  | 'emotional'
  | 'romantic'
  | 'creative'
  | 'protocol'

export type Motion =
  | 'runaway'
  | 'shrink'
  | 'teleport'
  | 'spin'
  | 'balloon'
  | 'dissolve'
  | 'split'
  | 'swap'
  | 'puzzle'
  | 'unavailable'
  | 'relabel'
  | 'heavy'
  | 'none'

export type OverlayKind =
  | 'none'
  | 'toast'
  | 'excuse'
  | 'story'
  | 'stats'
  | 'protocol'
  | 'minigame'
  | 'crash'
  | 'poem' // newly added!

export interface Experience {
  id: string
  stage: Stage
  motion: Motion
  overlay: OverlayKind
  /** Short line shown floating near the button. */
  caption?: string
  /** New text for the NO button when motion === 'relabel'. */
  relabel?: string
  /** Overlay content. */
  title?: string
  body?: string
  /** Stats payload. */
  stat?: { value: string; label: string }
  /** Personalized attributes */
  date?: string
  emoji?: string
  image?: string
  stanzas?: string[] // Newly added stanzas list
}

const STAGE_ORDER: Stage[] = [
  'cute',
  'funny',
  'personal',
  'emotional',
  'romantic',
  'creative',
  'protocol',
]

// ---------------------------------------------------------------------------
// Content pools from Configuration
// ---------------------------------------------------------------------------

const relabels = [
  'Maybe?',
  'Not yet',
  'Hmm…',
  'Ask again',
  'Almost',
  'No (jk)',
  'Re-thinking',
  'I might',
  'Wait—',
  'Define "no"',
  'Soften?',
  'Loading…',
  'Try Yes?',
  'Nope→Yes',
  'Okay fine?',
]

const cuteToasts = [
  'Aww, are you sure?',
  'That button felt shy.',
  'It blushed and ran.',
  'One more chance? Pretty please.',
  'My heart did a little flip.',
  'You almost smiled, I saw it.',
  'The "No" is being dramatic again.',
  "Even the pixels are pouting.",
  'Tiny puppy eyes activated.',
  'It hopped away like a bunny.',
]

const motionCaptions: Partial<Record<Motion, string[]>> = {
  runaway: ['Catch me first 😏', 'Too slow!', 'Nope — over here.', 'You’ll have to be quicker than that.'],
  shrink: ['It keeps getting smaller…', 'Tiny doubts, tiny button.', 'Barely there now.'],
  teleport: ['Blink and it’s gone.', 'Now you see it…', 'Teleported. Try again?'],
  spin: ['Wheee — no.', 'Dizzy yet?', 'Round and round.'],
  balloon: ['It floated away 🎈', 'Up, up, and away.', 'Gravity gave up on it.'],
  dissolve: ['It turned to stardust ✨', 'Poof. Reassembling…', 'Scattered into light.'],
  split: ['Which one is real? 👀', 'Decoys everywhere.', 'Pick wisely…'],
  swap: ['Wait — did they switch?', 'The buttons rearranged themselves.', 'Sneaky little shuffle.'],
  puzzle: ['It shattered into pieces.', 'Put it back… or don’t.', 'Broken, like I felt.'],
  unavailable: ['"No" is on a short break.', 'Temporarily out of order.', 'Back in a moment… maybe.'],
  heavy: ['It’s too heavy to press.', 'It won’t budge.', 'Weighed down by guilt.'],
}

// ---------------------------------------------------------------------------
// Build the library
// ---------------------------------------------------------------------------

function buildLibrary(): Experience[] {
  const list: Experience[] = []
  const push = (e: Omit<Experience, 'id'>) =>
    list.push({ id: `${e.stage}-${e.motion}-${e.overlay}-${list.length}`, ...e })

  // CUTE — relabels + gentle motions + cute toasts
  relabels.forEach((r) =>
    push({ stage: 'cute', motion: 'relabel', overlay: 'none', relabel: r, caption: 'It changed its mind.' }),
  )
  cuteToasts.forEach((t, i) =>
    push({
      stage: 'cute',
      motion: i % 2 === 0 ? 'shrink' : 'teleport',
      overlay: 'toast',
      body: t,
    }),
  )

  // FUNNY — excuses + playful motions
  CONFIG.excuses.forEach((t, i) =>
    push({
      stage: 'funny',
      motion: (['spin', 'balloon', 'split', 'teleport'] as Motion[])[i % 4],
      overlay: 'excuse',
      body: t,
    }),
  )
  ;(['spin', 'balloon', 'split', 'swap'] as Motion[]).forEach((m) =>
    (motionCaptions[m] ?? []).forEach((c) =>
      push({ stage: 'funny', motion: m, overlay: 'none', caption: c }),
    ),
  )

  // PERSONAL (stage 3) — Poem 1, Memories 1-5 (some with images, some without)
  if (CONFIG.poems.length > 0) {
    push({
      stage: 'personal',
      motion: 'spin',
      overlay: 'poem',
      title: CONFIG.poems[0].title,
      stanzas: CONFIG.poems[0].stanzas,
      caption: 'A poem for your heart...',
    })
  }
  CONFIG.memories.slice(0, 5).forEach((m, idx) => {
    push({
      stage: 'personal',
      motion: 'runaway',
      overlay: 'story',
      title: m.title,
      body: m.body,
      date: m.date,
      emoji: m.emoji,
      // Alternate showing images to mix up "photo vs just text memory"
      image: idx % 2 === 0 ? m.image : undefined,
      caption: idx % 2 === 0 ? 'Look at this photo 📸' : 'Remember this? ✨',
    })
  })

  // EMOTIONAL (stage 4) — Stats 1-2, Memories 6-10
  CONFIG.stats.slice(0, 2).forEach((s) =>
    push({ stage: 'emotional', motion: 'heavy', overlay: 'stats', stat: s }),
  )
  CONFIG.memories.slice(5, 10).forEach((m, idx) => {
    push({
      stage: 'emotional',
      motion: 'teleport',
      overlay: 'story',
      title: m.title,
      body: m.body,
      date: m.date,
      emoji: m.emoji,
      image: idx % 2 === 1 ? m.image : undefined,
      caption: idx % 2 === 1 ? 'Look at this photo 📸' : 'Remember this? ✨',
    })
  })

  // ROMANTIC (stage 5) — Poem 2, Memories 11-15, romantic toasts
  if (CONFIG.poems.length > 1) {
    push({
      stage: 'romantic',
      motion: 'dissolve',
      overlay: 'poem',
      title: CONFIG.poems[1].title,
      stanzas: CONFIG.poems[1].stanzas,
      caption: 'Another poem for you...',
    })
  }
  const romanticToasts = [
    `I’d rebuild this whole thing a thousand times for you, ${CONFIG.recipientName}.`,
    'Every pixel here is just me saying I’m sorry.',
    'You’re my favorite notification.',
    'I’d choose you in every version of this story.',
    'My calm, my chaos, my favorite person.',
  ]
  romanticToasts.forEach((t) =>
    push({ stage: 'romantic', motion: 'dissolve', overlay: 'toast', body: t }),
  )
  CONFIG.memories.slice(10, 15).forEach((m, idx) => {
    push({
      stage: 'romantic',
      motion: 'balloon',
      overlay: 'story',
      title: m.title,
      body: m.body,
      date: m.date,
      emoji: m.emoji,
      image: m.image, // romantic phase always displays photo if available
      caption: 'A sweet memory... 💖',
    })
  })

  // CREATIVE (stages 6-9) — Stats 3-5, Memories 16-20, impossible motions
  CONFIG.stats.slice(2).forEach((s) =>
    push({ stage: 'creative', motion: 'heavy', overlay: 'stats', stat: s }),
  )
  CONFIG.memories.slice(15).forEach((m, idx) => {
    push({
      stage: 'creative',
      motion: (['split', 'swap', 'puzzle', 'shrink', 'teleport'] as Motion[])[idx % 5],
      overlay: 'story',
      title: m.title,
      body: m.body,
      date: m.date,
      emoji: m.emoji,
      image: idx % 2 === 0 ? m.image : undefined,
      caption: 'Remember this? ✨',
    })
  })

  ;(['runaway', 'teleport', 'dissolve', 'split', 'swap', 'puzzle', 'unavailable', 'shrink', 'heavy'] as Motion[]).forEach(
    (m) =>
      (motionCaptions[m] ?? ['It found a new escape.']).forEach((c) =>
        push({ stage: 'creative', motion: m, overlay: 'none', caption: c }),
      ),
  )
  push({ stage: 'creative', motion: 'puzzle', overlay: 'minigame', title: 'Catch the No', body: 'Tap it 3 times if you can…' })
  push({ stage: 'creative', motion: 'dissolve', overlay: 'crash', title: 'Oops', body: 'Just kidding. Nothing crashed but my hopes.' })

  // PROTOCOL — self-aware finale from config
  CONFIG.protocolLines.forEach((t, i) =>
    push({
      stage: 'protocol',
      motion: (['runaway', 'teleport', 'dissolve', 'unavailable'] as Motion[])[i % 4],
      overlay: 'protocol',
      body: t,
    }),
  )

  return list
}

export const LIBRARY: Experience[] = buildLibrary()
export const LIBRARY_SIZE = LIBRARY.length

export function stageForAttempt(attempt: number): Stage {
  if (attempt === 1) return 'personal'
  if (attempt === 2) return 'funny'
  if (attempt === 3) return 'emotional'
  if (attempt === 4) return 'romantic'
  if (attempt <= 9) return 'creative'
  return 'protocol'
}

/**
 * Pick the next experience.
 * - Never repeats a seen id.
 * - Targets the stage for the current attempt, widening outward if needed.
 * - When everything has been seen, deterministically *combines* two seen
 *   experiences into a brand-new one so repetition never feels obvious.
 */
export function pickExperience(attempt: number, seen: string[]): Experience {
  const seenSet = new Set(seen)
  const target = stageForAttempt(attempt)
  const targetIdx = STAGE_ORDER.indexOf(target)

  // Search outward from the target stage for an unseen experience.
  for (let radius = 0; radius < STAGE_ORDER.length; radius++) {
    const stages = [STAGE_ORDER[targetIdx + radius], STAGE_ORDER[targetIdx - radius]].filter(
      Boolean,
    ) as Stage[]
    const pool = LIBRARY.filter((e) => stages.includes(e.stage) && !seenSet.has(e.id))
    if (pool.length) {
      return pool[Math.floor(Math.random() * pool.length)]
    }
  }

  // Exhausted: combine two distinct experiences into a fresh hybrid.
  const a = LIBRARY[Math.floor(Math.random() * LIBRARY.length)]
  let b = LIBRARY[Math.floor(Math.random() * LIBRARY.length)]
  if (b.id === a.id) b = LIBRARY[(LIBRARY.indexOf(a) + 1) % LIBRARY.length]
  const hybrid: Experience = {
    id: `combo-${a.id}+${b.id}-${attempt}`,
    stage: 'protocol',
    motion: a.motion,
    overlay: b.overlay,
    caption: a.caption ?? motionCaptions[a.motion]?.[0],
    relabel: a.relabel,
    title: b.title ?? 'Still here…',
    body: b.body ?? 'I’ve run out of new tricks, so now it’s just me asking sincerely.',
    stat: b.stat,
  }
  return hybrid
}
