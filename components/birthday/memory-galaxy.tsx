'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronRight, HelpCircle } from 'lucide-react'
import { CONFIG, type MemoryItem } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

// Coordinate percentage positions for constellation layout to form a beautiful snake path
const COORDINATES = [
  { x: 15, y: 30 },
  { x: 42, y: 20 },
  { x: 30, y: 50 },
  { x: 58, y: 45 },
  { x: 45, y: 75 },
  { x: 75, y: 70 },
  { x: 85, y: 35 },
]

export function MemoryGalaxy() {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null)
  const [hoveredMemory, setHoveredMemory] = useState<string | null>(null)

  // Map coordinate nodes to the memories list
  const nodes = useMemo(() => {
    return CONFIG.memories.slice(0, COORDINATES.length).map((m, idx) => ({
      ...m,
      x: COORDINATES[idx]?.x ?? 50,
      y: COORDINATES[idx]?.y ?? 50,
    }))
  }, [])

  const handleSelectNode = (node: MemoryItem) => {
    haptic('double')
    setSelectedMemory(node)
  }

  const handleClose = () => {
    haptic('tap')
    setSelectedMemory(null)
  }

  // Draw lines connecting the nodes sequentially
  const linePath = useMemo(() => {
    if (nodes.length < 2) return ''
    return nodes
      .map((node, idx) => `${idx === 0 ? 'M' : 'L'} ${node.x}% ${node.y}%`)
      .join(' ')
  }, [nodes])

  return (
    <div className="relative flex flex-col h-full w-full max-w-lg mx-auto select-none p-4">
      {/* Header Info */}
      <div className="mb-4 text-center mt-2 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl font-bold text-foreground text-glow flex items-center justify-center gap-1.5"
        >
          <Sparkles className="size-5 text-gold" />
          Memory Constellation
        </motion.h2>
        <p className="text-xs text-foreground/60 mt-1 max-w-[290px] mx-auto">
          Hover over or tap the glowing stars in our cosmic night sky to unlock milestones of us.
        </p>
      </div>

      {/* Constellation Canvas Container */}
      <div className="relative flex-1 min-h-[50vh] w-full rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xs p-2 shadow-2xl overflow-hidden">
        {/* Draw Constellation Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Glowing background line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="rgba(124, 58, 237, 0.15)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {/* Finer golden connection line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#constellation-grad)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />

          <defs>
            <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes (Stars) */}
        {nodes.map((node, idx) => {
          const isHovered = hoveredMemory === node.id
          const isSelected = selectedMemory?.id === node.id

          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Outer Pulsing Glow */}
              <motion.div
                className="absolute size-9 rounded-full bg-primary/25 -left-4.5 -top-4.5 pointer-events-none"
                animate={{
                  scale: isHovered || isSelected ? [1, 1.6, 1] : [1, 1.3, 1],
                  opacity: isHovered || isSelected ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Star Core */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.25 }}
                onClick={() => handleSelectNode(node)}
                onMouseEnter={() => setHoveredMemory(node.id)}
                onMouseLeave={() => setHoveredMemory(null)}
                className={`relative z-10 flex size-5 cursor-pointer items-center justify-center rounded-full border shadow-inner transition-colors duration-300 ${
                  isSelected
                    ? 'border-gold bg-gold text-stone-900'
                    : isHovered
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/20 bg-background/80 text-primary'
                }`}
              >
                <span className="text-[10px] font-bold select-none">{idx + 1}</span>
              </motion.button>

              {/* Tiny Label Tooltip (Visible on Hover / Small screens) */}
              <AnimatePresence>
                {isHovered && !selectedMemory && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-stone-950/90 border border-white/10 px-2 py-1 text-[10px] font-semibold text-white shadow-md z-30 pointer-events-none"
                  >
                    {node.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Small hint at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-foreground/40 flex items-center gap-1">
          <HelpCircle className="size-3" />
          <span>Nodes represent our timeline</span>
        </div>
      </div>

      {/* Polaroid Detailed Popup Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Vintage Polaroid Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative z-10 w-full max-w-sm bg-stone-50 border border-stone-200/80 p-5 pb-7 shadow-2xl rounded-xs text-stone-900 select-none rotate-1"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                type="button"
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 shadow-sm border border-stone-300/40 z-30 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>

              {/* Photo Area inside Polaroid */}
              <div className="relative aspect-square w-full bg-stone-100 border border-stone-250 overflow-hidden flex items-center justify-center rounded-xs shadow-inner mb-4">
                {selectedMemory.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedMemory.image}
                    alt={selectedMemory.title}
                    className="h-full w-full object-cover grayscale-[10%] hover:grayscale-0 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-6xl">{selectedMemory.emoji}</span>
                    <span className="text-[10px] text-stone-400 font-mono">Capture</span>
                  </div>
                )}
                {selectedMemory.image && (
                  <div className="absolute bottom-2.5 right-2.5 bg-stone-50/95 text-xl rounded-full size-9 flex items-center justify-center shadow-md border border-stone-200">
                    {selectedMemory.emoji}
                  </div>
                )}
              </div>

              {/* Description Details */}
              <div className="text-center font-serif px-1">
                <span className="font-mono text-[9px] tracking-widest text-stone-400 block uppercase">
                  {selectedMemory.date}
                </span>
                <h3 className="text-stone-850 font-bold text-lg leading-snug mt-1.5">
                  {selectedMemory.title}
                </h3>
                <p className="text-stone-600 font-sans text-xs leading-relaxed mt-2.5 border-t border-stone-200/40 pt-2.5 italic">
                  "{selectedMemory.body}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
