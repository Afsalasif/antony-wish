// Central configuration file for the personalized Happy Birthday website.
// You can modify these values to change the messages, memories, and assets.

export interface MemoryItem {
  id: string
  title: string
  date: string
  body: string
  emoji: string
  image?: string // Path to images in /public
}

export interface CapsuleWish {
  id: string
  type: 'coupon' | 'wish'
  title: string
  text: string
  icon: string
  color: string // Tailwind gradient colors
}

export interface BirthdayFlower {
  id: string
  name: string
  color: string
  symbolism: string
  message: string
  icon: string
}

export interface BirthdayConfig {
  recipientName: string
  senderName: string
  birthdayWishTitle: string
  introSubtitle: string
  letter: {
    salutation: string
    paragraphs: string[]
    closing: string
    signature: string
  }
  memories: MemoryItem[]
  capsules: CapsuleWish[]
  flowers: BirthdayFlower[]
}

export const CONFIG: BirthdayConfig = {
  recipientName: 'Koche',
  senderName: 'Afzal',
  birthdayWishTitle: 'Happy Birthday, Koche! 🎂✨',
  introSubtitle: 'A little cosmic corner built just for you, to celebrate another beautiful year of your existence. Take your time exploring the stars.',
  
  letter: {
    salutation: 'Dearest Koche,',
    paragraphs: [
      'Happy Birthday, my love. 🎂❤️',
      'I know things haven\'t been easy between us lately, and we may be facing challenges that neither of us expected. But today isn\'t about our problems—it\'s about celebrating you and the wonderful person you are.',
      'No matter where we stand right now, I am grateful for the memories we\'ve shared and the happiness you\'ve brought into my life. You deserve a day filled with peace, joy, and love, and I truly hope this year brings you strength, growth, and everything your heart wishes for.',
      'Thank you for being part of my journey. I care about you deeply, and on your special day, I wish you nothing but happiness and beautiful moments.',
      'Happy Birthday. May your year ahead be as beautiful as your smile. ❤️'
    ],
    closing: '',
    signature: 'your kooli'
  },

  memories: [
    {
      id: 'mem-1',
      title: 'Our First Conversation',
      date: 'Late Night Talks',
      body: 'The spark that started it all. We spoke about everything and nothing until the birds started chirping, and I knew right then you were special.',
      emoji: '📞',
      image: '/a1.jpeg',
    },
    {
      id: 'mem-2',
      title: 'Comfort in Silence',
      date: 'Cozy Afternoons',
      body: 'Sitting side by side, reading or just dreaming, without saying a single word. Knowing that just your presence is enough to quiet the whole world.',
      emoji: '📖',
      image: '/a2.jpeg',
    },
    {
      id: 'mem-3',
      title: 'Stolen Fries & Shared Laughs',
      date: 'Dinner Dates',
      body: 'You stealing my food and looking absolutely innocent. I realized in that moment I would gladly let you have the whole world if you asked.',
      emoji: '🍟',
      image: '/a3.jpeg',
    },
    {
      id: 'mem-4',
      title: 'The Playlist We Built',
      date: 'Musical Connections',
      body: 'Adding songs one by one, creating a soundscape of our journey. Every time a melody plays, it carries your smile to my mind.',
      emoji: '🎵',
      image: '/a4.jpeg',
    },
    {
      id: 'mem-5',
      title: 'Coffee in the Rain',
      date: 'Autumn Days',
      body: 'Getting caught in a sudden downpour, sitting by the window in a cozy cafe, watching steam rise from our cups while laughing at our wet hair.',
      emoji: '☕',
      image: '/a5.jpeg',
    },
    {
      id: 'mem-6',
      title: 'Grocery Store Adventures',
      date: 'Simple Moments',
      body: 'Riding in shopping carts and debating which snack is superior. You showed me that even the most mundane chores become adventures when shared with you.',
      emoji: '🛒',
      image: '/a1.jpeg',
    },
    {
      id: 'mem-7',
      title: 'Watching the Sunset',
      date: 'Golden Hour',
      body: 'Sitting in silence, your head resting on my shoulder, watching the sky paint itself in gold and pink. A moment I wanted to freeze forever.',
      emoji: '🌅',
      image: '/a2.jpeg',
    }
  ],

  capsules: [
    {
      id: 'cap-1',
      type: 'coupon',
      title: 'Infinite Hugs Coupon',
      text: 'Good for unlimited warm, tight hugs whenever you feel cold, stressed, or just need a soft landing. Never expires.',
      icon: '🤗',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'cap-2',
      type: 'wish',
      title: 'A Wish for Peace',
      text: 'May your mind always be a sanctuary of calm, free from doubts, and may you sleep peacefully knowing you are cherished.',
      icon: '🕊️',
      color: 'from-sky-400 to-indigo-500'
    },
    {
      id: 'cap-3',
      type: 'coupon',
      title: 'Midnight Coffee & Dessert Date',
      text: 'Redeemable for a late-night run to your favorite cafe, complete with warm chocolate cake and deep conversations.',
      icon: '🍰',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'cap-4',
      type: 'wish',
      title: 'A Wish for Radiance',
      text: 'May you always keep that glowing smile of yours. It has the power to light up the darkest rooms and heal my worst days.',
      icon: '✨',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      id: 'cap-5',
      type: 'coupon',
      title: 'One Day of Complete Pampering',
      text: 'A full day where you rule. I will do all chores, cook your favorite meals, and set up a movie marathon just for you.',
      icon: '👑',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'cap-6',
      type: 'wish',
      title: 'A Wish for Adventure',
      text: 'May this year take you to new heights, show you beautiful places you’ve never seen, and fill your passport with memories.',
      icon: '🌍',
      color: 'from-emerald-400 to-teal-500'
    }
  ],

  flowers: [
    {
      id: 'rose',
      name: 'Crimson Rose',
      color: 'from-rose-500 to-rose-700',
      symbolism: 'Boundless Love & Adoration',
      message: 'To remind you of the deep love I hold for you, growing stronger with each passing year.',
      icon: '🌹',
    },
    {
      id: 'tulip',
      name: 'Graceful Tulip',
      color: 'from-pink-400 to-pink-600',
      symbolism: 'Happiness & Gentle Care',
      message: 'Your joy is my absolute priority. I wish to nurture and protect your lovely smile.',
      icon: '🌷',
    },
    {
      id: 'lavender',
      name: 'Tranquil Lavender',
      color: 'from-purple-400 to-purple-600',
      symbolism: 'Peace, Calm & Healing',
      message: 'Bringing quiet comfort and relaxing warmth to your heart on this new chapter.',
      icon: '🪻',
    },
    {
      id: 'sunflower',
      name: 'Radiant Sunflower',
      color: 'from-amber-400 to-yellow-500',
      symbolism: 'Loyalty & Vitality',
      message: 'You are the light that brightens my greyest days. Stay bright and true, always.',
      icon: '🌻',
    },
    {
      id: 'daisy',
      name: 'Fresh Daisy',
      color: 'from-yellow-200 to-amber-300',
      symbolism: 'New Beginnings & Innocence',
      message: 'A symbol of fresh opportunities and simple, pure joy for your next trip around the sun.',
      icon: '🌼',
    }
  ]
}
