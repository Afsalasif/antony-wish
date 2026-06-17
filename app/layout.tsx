import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Happy Birthday, my Koche! 🎂❤️',
  description: "You are mine and I'm yours. Always. ❤️",
  generator: 'v0.app',
  applicationName: 'Birthday Galaxy',
  openGraph: {
    title: 'Happy Birthday, my Koche! 🎂❤️',
    description: "You are mine and I'm yours. Always. ❤️",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Birthday, my Koche! 🎂❤️',
    description: "You are mine and I'm yours. Always. ❤️",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Birthday Galaxy',
  },
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#2a0f1f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
