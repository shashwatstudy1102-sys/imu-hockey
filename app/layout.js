import './globals.css'
import { Oswald, Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-heading' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata = {
  title: 'IMU Kolkata Campus Hockey Team',
  description:
    'Official website of the Indian Maritime University Kolkata Campus Hockey Team (Erstwhile DMET, Erstwhile MERI).',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
