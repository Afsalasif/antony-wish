'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Heart, Sparkles, Plus } from 'lucide-react'
import { CONFIG } from '@/lib/personalized-config'
import { haptic } from '@/lib/haptics'

interface PlacedFlower {
  id: string
  key: number
  x: number // percentage offset
  y: number // percentage offset
  scale: number
  rotation: number
  emoji: string
  color: string
  name: string
}

export function FlowerBouquetBuilder() {
  const [placedFlowers, setPlacedFlowers] = useState<PlacedFlower[]>([])
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [latestFlowerName, setLatestFlowerName] = useState<string | null>(null)

  const handleAddFlower = (flowerId: string) => {
    const flowerType = CONFIG.bouquetFlowers.find((f) => f.id === flowerId)
    if (!flowerType) return

    haptic('tap')
    
    const newFlower: PlacedFlower = {
      id: flowerId,
      key: Date.now() + Math.random(),
      // Random coordinates inside the top portion of the vase / bouquet area
      x: (Math.random() * 50 - 25), // -25% to 25% from center
      y: (Math.random() * 40 - 55), // -55% to -15% (above the vase rim)
      scale: 0.85 + Math.random() * 0.3,
      rotation: (Math.random() * 50 - 25), // -25deg to 25deg
      emoji: flowerType.icon,
      color: flowerType.color,
      name: flowerType.name,
    }

    setPlacedFlowers((prev) => [...prev, newFlower])
    setSelectedMessage(flowerType.message)
    setLatestFlowerName(flowerType.name)
  }

  const handleClear = () => {
    haptic('success')
    setPlacedFlowers([])
    setSelectedMessage(null)
    setLatestFlowerName(null)
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Build Forgiveness Flora
        </h3>
        <p className="text-xs text-foreground/60 mt-1">
          Pick flowers to fill the vase and read their messages
        </p>
      </div>

      {/* Interactive Bouquet Canvas */}
      <div className="relative flex h-64 w-full max-w-sm items-center justify-center rounded-3xl border border-foreground/10 bg-gradient-to-b from-primary/5 to-secondary/10 p-4 shadow-inner overflow-hidden">
        {/* Decorative sparkles in background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <Sparkles className="absolute left-6 top-6 size-4 text-gold animate-pulse" />
          <Sparkles className="absolute right-8 top-12 size-5 text-primary animate-bounce" />
          <Sparkles className="absolute left-12 bottom-16 size-3 text-gold" />
        </div>

        {/* Placed Flowers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {placedFlowers.map((f) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 150, scale: 0.2 }}
                animate={{ 
                  opacity: 1, 
                  y: f.y, 
                  x: f.x, 
                  scale: f.scale, 
                  rotate: f.rotation 
                }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="absolute origin-bottom select-none text-5xl filter drop-shadow-md cursor-default"
                style={{ bottom: '38%' }}
              >
                {f.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Glass Vase */}
        <div className="absolute bottom-6 flex flex-col items-center pointer-events-none">
          {/* Vase Rim */}
          <div className="h-2.5 w-24 rounded-full border border-white/20 bg-white/20 backdrop-blur-md shadow-md" />
          {/* Vase Body */}
          <div className="relative h-24 w-20 rounded-b-3xl rounded-t-lg border border-white/20 bg-gradient-to-b from-white/10 to-white/30 backdrop-blur-md shadow-2xl flex items-center justify-center">
            {/* Water line */}
            <div className="absolute bottom-2 inset-x-1.5 h-12 rounded-b-2xl bg-sky-300/30 border-t border-sky-200/40" />
            <Heart className="size-6 text-primary/70 fill-primary/30 z-10 animate-pulse" />
          </div>
        </div>

        {/* Floating Count badge */}
        {placedFlowers.length > 0 && (
          <div className="absolute right-4 bottom-4 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
            {placedFlowers.length} {placedFlowers.length === 1 ? 'flower' : 'flowers'}
          </div>
        )}
      </div>

      {/* Flower Selector Options */}
      <div className="mt-4 grid grid-cols-4 gap-2.5 w-full max-w-sm">
        {CONFIG.bouquetFlowers.map((flower) => (
          <button
            key={flower.id}
            onClick={() => handleAddFlower(flower.id)}
            type="button"
            className="flex flex-col items-center p-2 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.05] transition active:scale-95 group relative"
          >
            <span className="text-3xl filter group-hover:scale-110 transition duration-300">
              {flower.icon}
            </span>
            <span className="text-[10px] font-semibold text-foreground/80 mt-1 truncate max-w-full">
              {flower.name}
            </span>
            <div className="absolute -top-1 -right-1 size-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-white shadow-md">
              <Plus className="size-2.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Note message from last placed flower */}
      <AnimatePresence mode="wait">
        {selectedMessage ? (
          <motion.div
            key={selectedMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 w-full max-w-sm rounded-2xl border border-gold/20 bg-gold/5 p-4 shadow-lg flex items-start gap-2.5"
          >
            <div className="mt-0.5 text-lg text-gold">💝</div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                Message from {latestFlowerName}
              </span>
              <p className="text-xs text-foreground/80 leading-relaxed mt-0.5 italic">
                "{selectedMessage}"
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="h-[74px] flex items-center justify-center mt-5">
            <p className="text-xs text-foreground/40 italic">
              Click flowers above to start assembling a custom bouquet
            </p>
          </div>
        )}
      </AnimatePresence>

      {placedFlowers.length > 0 && (
        <button
          onClick={handleClear}
          type="button"
          className="mt-3 text-xs text-foreground/50 hover:text-foreground/80 underline underline-offset-2 transition"
        >
          Clear vase
        </button>
      )}
    </div>
  )
}
