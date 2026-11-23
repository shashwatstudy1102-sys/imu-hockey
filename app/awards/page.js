import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AwardsPage() {
  const supabase = await createClient()
  const { data: awards } = await supabase
    .from('awards')
    .select('*')
    .order('year', { ascending: false })

  return (
    <section className="pub-section container">
      <p className="pub-kicker">Hall of Honour</p>
      <h1 className="pub-title">Trophies & Achievements</h1>
      <p className="pub-sub">
        Championships, podium finishes, and honours earned by the IMU Kolkata Campus Hockey Team.
      </p>

      {!awards || awards.length === 0 ? (
        <p className="pub-sub">No awards recorded yet. Add trophies from the Admin Dashboard.</p>
      ) : (
        <div className="awards-grid">
          {awards.map((a) => (
            <div key={a.id} className="award-card">
              {a.photo_url && <img src={a.photo_url} alt={a.tournament} className="award-photo" />}
              <div className="award-body">
                <p className="award-year">{a.year}</p>
                <h3>{a.tournament}</h3>
                <span className="award-pos">{a.position}</span>
                {a.description && <p className="award-desc">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}