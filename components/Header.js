import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import '../app/auth.css'

export default async function Header() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null
  } catch {
    user = null
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="logo" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-title">Indian Maritime University</span>
            <span className="brand-sub">Kolkata Campus Hockey</span>
            <span className="brand-erst">Erstwhile DMET &bull; Erstwhile MERI</span>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/team">Team</Link>
          <Link href="/awards">Awards</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about-hockey">The Game</Link>
          {user ? (
            <>
              <Link href="/admin">Dashboard</Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="nav-login">Admin Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
