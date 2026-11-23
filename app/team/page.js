import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('is_captain', { ascending: false })
    .order('jersey_number', { ascending: true })
    .order('full_name', { ascending: true })

  // Group players automatically by their batch
  const groupedByBatch = {}
  if (players) {
    for (const player of players) {
      const batchKey = player.batch?.trim() || 'Other Squad Members'
      if (!groupedByBatch[batchKey]) {
        groupedByBatch[batchKey] = []
      }
      groupedByBatch[batchKey].push(player)
    }
  }

  // Sort batch names alphabetically/numerically (newest batch first, 'Other Squad Members' last)
  const sortedBatches = Object.keys(groupedByBatch).sort((a, b) => {
    if (a === 'Other Squad Members') return 1
    if (b === 'Other Squad Members') return -1
    return b.localeCompare(a, undefined, { numeric: true })
  })

  return (
    <section className="pub-section container">
      <p className="pub-kicker">Official Squad</p>
      <h1 className="pub-title">IMU Kolkata Hockey Team</h1>
      <p className="pub-sub">
        Meet the cadets representing Indian Maritime University, Kolkata Campus (Erstwhile DMET • Erstwhile MERI) on the turf, organized by batch.
      </p>

      {!players || players.length === 0 ? (
        <p className="pub-sub">No players added yet. Add squad members from the Admin Dashboard.</p>
      ) : (
        sortedBatches.map((batchName) => (
          <div key={batchName} className="batch-section">
            <h2 className="batch-heading">
              {batchName === 'Other Squad Members' ? batchName : `Batch ${batchName}`}
              <span className="batch-count">{groupedByBatch[batchName].length} Players</span>
            </h2>

            <div className="team-grid">
              {groupedByBatch[batchName].map((p) => (
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
                      {[p.roll_number && `Roll No: ${p.roll_number}`, p.position, p.department]
                        .filter(Boolean)
                        .join(' • ') || 'Squad Player'}
                    </p>
                    {p.is_captain && <span className="captain-tag">Team Captain</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  )
}