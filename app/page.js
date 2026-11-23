import Link from 'next/link'
import HeroArt from '@/components/HeroArt'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getCounts() {
  try {
    const supabase = await createClient()
    const [awards, matches, players] = await Promise.all([
      supabase.from('awards').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('players').select('*', { count: 'exact', head: true }),
    ])
    return {
      awards: awards.count ?? 0,
      matches: matches.count ?? 0,
      players: players.count ?? 0,
      connected: !awards.error && !matches.error && !players.error,
    }
  } catch {
    return { awards: 0, matches: 0, players: 0, connected: false }
  }
}

export default async function Home() {
  const stats = await getCounts()
  const ticker = 'DMET \u2022 MERI \u2022 IMU KOLKATA \u2022 STRIKE \u2022 SAIL \u2022 SUCCEED \u2022 '

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-bg-word" aria-hidden="true">HOCKEY</div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">Indian Maritime University &bull; Kolkata Campus</p>
            <h1>
              Strike.<br />
              <span className="grad">Sail.</span><br />
              Succeed.
            </h1>
            <p className="hero-text">
              The official home of the IMU Kolkata Campus Hockey Team, erstwhile DMET and
              erstwhile MERI. Meet the players, relive the victories, follow every match.
            </p>
            <div className="hero-buttons">
              <Link href="/team" className="btn btn-gold">Meet the Team</Link>
              <Link href="/awards" className="btn btn-ghost">Our Awards</Link>
            </div>
          </div>
          <div className="hero-art-wrap"><HeroArt /></div>
        </div>
        <svg className="waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 C240 120 480 0 720 60 C960 120 1200 0 1440 60 L1440 120 L0 120 Z" />
        </svg>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>{ticker.repeat(6)}</span>
          <span>{ticker.repeat(6)}</span>
        </div>
      </div>

      <section className="container stats-grid">
        <div className="stat"><span className="stat-number">{stats.players}</span><span className="stat-label">Players</span></div>
        <div className="stat"><span className="stat-number">{stats.awards}</span><span className="stat-label">Awards Won</span></div>
        <div className="stat"><span className="stat-number">{stats.matches}</span><span className="stat-label">Matches</span></div>
      </section>

      <section className="section">
        <div className="container cards">
          <Link href="/team" className="card"><span className="card-num">01</span><h3>The Team</h3><p>Every player, position and jersey number.</p></Link>
          <Link href="/awards" className="card"><span className="card-num">02</span><h3>Achievements</h3><p>Trophies and titles won by our team.</p></Link>
          <Link href="/gallery" className="card"><span className="card-num">03</span><h3>Gallery</h3><p>Moments from the field, our team in action.</p></Link>
        </div>
      </section>

      {!stats.connected && (
        <p className="notice">Setup note: the website could not reach Supabase. Check your .env.local file.</p>
      )}
    </>
  )
}
