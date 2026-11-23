import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('is_captain', { ascending: false })
    .order('jersey_number', { ascending: true })

  return (
    <section className="pub-section container">
      <p className="pub-kicker">Official Squad</p>
      <h1 className="pub-title">IMU Kolkata Hockey Team</h1>
      <p className="pub-sub">
        Meet the cadets representing Indian Maritime University, Kolkata Campus (Erstwhile DMET • Erstwhile MERI) on the turf.
      </p>

      {!players || players.length === 0 ? (
        <p className="pub-sub">No players added yet. Add squad members from the Admin Dashboard.</p>
      ) : (
        <div className="team-grid">
          {players.map((p) => (
            <div key={p.id} className="player-card">
              {p.photo_url ? (
                <img src={p.photo_url} alt={p.full_name} className="player-photo" />
              ) : (
                <div className="player-placeholder">
                  {p.jersey_number ? `#${p.jersey_number}` : p.full_name.charAt(0)}
                </div>
              )}
              <div className="player-body">
                <div className="player-top">
                  <h3 className="player-name">{p.full_name}</h3>
                  {p.jersey_number && <span className="player-num">#{p.jersey_number}</span>}
                </div>
                <p className="player-meta">
  {[p.roll_number && `Roll No: ${p.roll_number}`, p.position, p.department, p.batch]
    .filter(Boolean)
    .join(' • ') || 'Squad Player'}
</p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}