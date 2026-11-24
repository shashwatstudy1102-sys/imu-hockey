'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const supabase = createClient()
  const [tab, setTab] = useState('players')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const [players, setPlayers] = useState([])
  const [awards, setAwards] = useState([])
  const [matches, setMatches] = useState([])
  const [gallery, setGallery] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [replyDrafts, setReplyDrafts] = useState({})

  const emptyPlayer = {
    id: null,
    full_name: '',
    roll_number: '',
    jersey_number: '',
    position: '',
    department: '',
    batch: '',
    photo_url: '',
    is_captain: false,
  }
  const [playerForm, setPlayerForm] = useState(emptyPlayer)

  const emptyAward = {
    id: null,
    tournament: '',
    year: new Date().getFullYear(),
    position: '',
    description: '',
    photo_url: '',
  }
  const [awardForm, setAwardForm] = useState(emptyAward)

  const emptyMatch = {
    id: null,
    opponent: '',
    match_date: '',
    venue: '',
    result: '',
  }
  const [matchForm, setMatchForm] = useState(emptyMatch)

  const [galleryForm, setGalleryForm] = useState({ caption: '', image_url: '' })
  const [file, setFile] = useState(null)

  const loadAll = useCallback(async () => {
    const [p, a, m, g, enq] = await Promise.all([
      supabase.from('players').select('*').order('jersey_number', { ascending: true }),
      supabase.from('awards').select('*').order('year', { ascending: false }),
      supabase.from('matches').select('*').order('match_date', { ascending: false }),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      supabase.from('enquiries').select('*, enquiry_replies(*)').order('created_at', { ascending: false }),
    ])
    if (p.data) setPlayers(p.data)
    if (a.data) setAwards(a.data)
    if (m.data) setMatches(m.data)
    if (g.data) setGallery(g.data)
    if (enq.data) setEnquiries(enq.data)
  }, [supabase])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  async function uploadPhoto(selectedFile, folder) {
    if (!selectedFile) return null
    const ext = selectedFile.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(fileName, selectedFile)
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data } = supabase.storage.from('media').getPublicUrl(fileName)
    return data.publicUrl
  }

  async function savePlayer(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const uploadedUrl = await uploadPhoto(file, 'players')
      const payload = {
        full_name: playerForm.full_name,
        roll_number: playerForm.roll_number || null,
        jersey_number: playerForm.jersey_number ? Number(playerForm.jersey_number) : null,
        position: playerForm.position,
        department: playerForm.department,
        batch: playerForm.batch,
        photo_url: uploadedUrl || playerForm.photo_url || null,
        is_captain: playerForm.is_captain,
      }
      const { error } = playerForm.id
        ? await supabase.from('players').update(payload).eq('id', playerForm.id)
        : await supabase.from('players').insert([payload])
      if (error) throw error
      setPlayerForm(emptyPlayer)
      setFile(null)
      setStatus(playerForm.id ? 'Player updated!' : 'Player added!')
      loadAll()
    } catch (err) {
      setStatus(err.message)
    }
    setSaving(false)
  }

  async function saveAward(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const uploadedUrl = await uploadPhoto(file, 'awards')
      const payload = {
        tournament: awardForm.tournament,
        year: Number(awardForm.year),
        position: awardForm.position,
        description: awardForm.description,
        photo_url: uploadedUrl || awardForm.photo_url || null,
      }
      const { error } = awardForm.id
        ? await supabase.from('awards').update(payload).eq('id', awardForm.id)
        : await supabase.from('awards').insert([payload])
      if (error) throw error
      setAwardForm(emptyAward)
      setFile(null)
      setStatus(awardForm.id ? 'Award updated!' : 'Award added!')
      loadAll()
    } catch (err) {
      setStatus(err.message)
    }
    setSaving(false)
  }

  async function saveMatch(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const payload = {
        opponent: matchForm.opponent,
        match_date: matchForm.match_date ? new Date(matchForm.match_date).toISOString() : null,
        venue: matchForm.venue,
        result: matchForm.result || 'Upcoming',
      }
      const { error } = matchForm.id
        ? await supabase.from('matches').update(payload).eq('id', matchForm.id)
        : await supabase.from('matches').insert([payload])
      if (error) throw error
      setMatchForm(emptyMatch)
      setStatus(matchForm.id ? 'Match updated!' : 'Match scheduled!')
      loadAll()
    } catch (err) {
      setStatus(err.message)
    }
    setSaving(false)
  }

  async function saveGallery(e) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const uploadedUrl = await uploadPhoto(file, 'gallery')
      const finalUrl = uploadedUrl || galleryForm.image_url
      if (!finalUrl) throw new Error('Please choose a photo file or paste an image URL.')
      const { error } = await supabase.from('gallery').insert([
        { image_url: finalUrl, caption: galleryForm.caption },
      ])
      if (error) throw error
      setGalleryForm({ caption: '', image_url: '' })
      setFile(null)
      setStatus('Photo added to gallery!')
      loadAll()
    } catch (err) {
      setStatus(err.message)
    }
    setSaving(false)
  }

  async function saveEnquiryReply(enquiryId) {
    const text = (replyDrafts[enquiryId] || '').trim()
    if (!text) return
    setSaving(true)
    setStatus('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('enquiry_replies').insert([
        {
          enquiry_id: enquiryId,
          admin_id: user?.id ?? null,
          admin_name: user?.email || 'Team Admin',
          reply_text: text,
        },
      ])
      if (error) throw error
      await supabase.from('enquiries').update({ status: 'answered' }).eq('id', enquiryId)
      setReplyDrafts((prev) => ({ ...prev, [enquiryId]: '' }))
      setStatus('Reply posted!')
      loadAll()
    } catch (err) {
      setStatus(err.message)
    }
    setSaving(false)
  }

  async function handleDelete(table, id) {
    if (!confirm('Are you sure you want to delete this entry?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) setStatus(error.message)
    else {
      setStatus('Deleted successfully.')
      loadAll()
    }
  }

  function switchTab(newTab) {
    setTab(newTab)
    setStatus('')
    setFile(null)
  }

  return (
    <div>
      <div className="admin-tabs">
        {['players', 'awards', 'matches', 'gallery', 'enquiries'].map((t) => (
          <button
            key={t}
            type="button"
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => switchTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'players' && (
        <div className="admin-panel">
          <form className="admin-form-card" onSubmit={savePlayer}>
            <h2>{playerForm.id ? 'Edit Player' : 'Add Player'}</h2>
            <label>Full Name *</label>
            <input
              required
              value={playerForm.full_name}
              onChange={(e) => setPlayerForm({ ...playerForm, full_name: e.target.value })}
            />
            <label>Roll Number</label>
            <input
              placeholder="e.g. 2026ME042"
              value={playerForm.roll_number}
              onChange={(e) => setPlayerForm({ ...playerForm, roll_number: e.target.value })}
            />
            <label>Jersey Number</label>
            <input
              type="number"
              value={playerForm.jersey_number}
              onChange={(e) => setPlayerForm({ ...playerForm, jersey_number: e.target.value })}
            />
            <label>Position</label>
            <input
              placeholder="e.g. Forward, Midfielder, Goalkeeper"
              value={playerForm.position}
              onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
            />
            <label>Department / Course</label>
            <input
              placeholder="e.g. Marine Engineering"
              value={playerForm.department}
              onChange={(e) => setPlayerForm({ ...playerForm, department: e.target.value })}
            />
            <label>Batch / Year</label>
            <input
              placeholder="e.g. 2026–2030"
              value={playerForm.batch}
              onChange={(e) => setPlayerForm({ ...playerForm, batch: e.target.value })}
            />
            <label>Upload Photo (or paste URL below)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <input
              placeholder="https://..."
              style={{ marginTop: 6 }}
              value={playerForm.photo_url}
              onChange={(e) => setPlayerForm({ ...playerForm, photo_url: e.target.value })}
            />
            <label className="admin-check">
              <input
                type="checkbox"
                checked={playerForm.is_captain}
                onChange={(e) => setPlayerForm({ ...playerForm, is_captain: e.target.checked })}
              />
              Team Captain
            </label>
            {status && <p className="admin-msg">{status}</p>}
            <button type="submit" className="btn btn-gold auth-btn" disabled={saving}>
              {saving ? 'Saving...' : playerForm.id ? 'Update Player' : 'Add Player'}
            </button>
            {playerForm.id && (
              <button
                type="button"
                className="btn-sm btn-cancel"
                onClick={() => setPlayerForm(emptyPlayer)}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="admin-list">
            {players.length === 0 && <p>No players added yet.</p>}
            {players.map((p) => (
              <div key={p.id} className="admin-item">
                <div className="admin-item-info">
                  {p.photo_url && (
                    <img src={p.photo_url} alt={p.full_name} className="admin-thumb" />
                  )}
                  <div>
                    <h4>
                      {p.jersey_number ? `#${p.jersey_number} ` : ''}
                      {p.full_name}
                      {p.is_captain && <span className="admin-badge">Captain</span>}
                    </h4>
                    <p>
                      {[
                        p.roll_number && `Roll: ${p.roll_number}`,
                        p.position,
                        p.department,
                        p.batch,
                      ]
                        .filter(Boolean)
                        .join(' • ') || 'Team Member'}
                    </p>
                  </div>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn-sm btn-edit"
                    onClick={() =>
                      setPlayerForm({
                        ...p,
                        roll_number: p.roll_number ?? '',
                        jersey_number: p.jersey_number ?? '',
                        position: p.position ?? '',
                        department: p.department ?? '',
                        batch: p.batch ?? '',
                        photo_url: p.photo_url ?? '',
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-del"
                    onClick={() => handleDelete('players', p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'awards' && (
        <div className="admin-panel">
          <form className="admin-form-card" onSubmit={saveAward}>
            <h2>{awardForm.id ? 'Edit Award' : 'Add Award'}</h2>
            <label>Tournament Name *</label>
            <input
              required
              value={awardForm.tournament}
              onChange={(e) => setAwardForm({ ...awardForm, tournament: e.target.value })}
            />
            <label>Year *</label>
            <input
              type="number"
              required
              value={awardForm.year}
              onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
            />
            <label>Position / Title *</label>
            <input
              required
              placeholder="e.g. Champions, Runners-Up"
              value={awardForm.position}
              onChange={(e) => setAwardForm({ ...awardForm, position: e.target.value })}
            />
            <label>Description</label>
            <textarea
              rows={3}
              value={awardForm.description}
              onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
            />
            <label>Trophy / Team Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <input
              placeholder="https://..."
              style={{ marginTop: 6 }}
              value={awardForm.photo_url}
              onChange={(e) => setAwardForm({ ...awardForm, photo_url: e.target.value })}
            />
            {status && <p className="admin-msg">{status}</p>}
            <button type="submit" className="btn btn-gold auth-btn" disabled={saving}>
              {saving ? 'Saving...' : awardForm.id ? 'Update Award' : 'Add Award'}
            </button>
            {awardForm.id && (
              <button
                type="button"
                className="btn-sm btn-cancel"
                onClick={() => setAwardForm(emptyAward)}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="admin-list">
            {awards.length === 0 && <p>No awards recorded yet.</p>}
            {awards.map((a) => (
              <div key={a.id} className="admin-item">
                <div className="admin-item-info">
                  {a.photo_url && (
                    <img src={a.photo_url} alt={a.tournament} className="admin-thumb" />
                  )}
                  <div>
                    <h4>
                      {a.tournament} ({a.year}){' '}
                      <span className="admin-badge">{a.position}</span>
                    </h4>
                    <p>{a.description}</p>
                  </div>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn-sm btn-edit"
                    onClick={() =>
                      setAwardForm({
                        ...a,
                        description: a.description ?? '',
                        photo_url: a.photo_url ?? '',
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-del"
                    onClick={() => handleDelete('awards', a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'matches' && (
        <div className="admin-panel">
          <form className="admin-form-card" onSubmit={saveMatch}>
            <h2>{matchForm.id ? 'Edit Match' : 'Schedule Match'}</h2>
            <label>Opponent Team *</label>
            <input
              required
              placeholder="e.g. IIT Kharagpur"
              value={matchForm.opponent}
              onChange={(e) => setMatchForm({ ...matchForm, opponent: e.target.value })}
            />
            <label>Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={matchForm.match_date}
              onChange={(e) => setMatchForm({ ...matchForm, match_date: e.target.value })}
            />
            <label>Venue</label>
            <input
              placeholder="e.g. DMET Ground, Kolkata"
              value={matchForm.venue}
              onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
            />
            <label>Result / Score</label>
            <input
              placeholder="e.g. Won 3-1 (or leave blank for Upcoming)"
              value={matchForm.result}
              onChange={(e) => setMatchForm({ ...matchForm, result: e.target.value })}
            />
            {status && <p className="admin-msg">{status}</p>}
            <button type="submit" className="btn btn-gold auth-btn" disabled={saving}>
              {saving ? 'Saving...' : matchForm.id ? 'Update Match' : 'Save Match'}
            </button>
            {matchForm.id && (
              <button
                type="button"
                className="btn-sm btn-cancel"
                onClick={() => setMatchForm(emptyMatch)}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="admin-list">
            {matches.length === 0 && <p>No matches scheduled yet.</p>}
            {matches.map((m) => (
              <div key={m.id} className="admin-item">
                <div>
                  <h4>
                    vs {m.opponent}{' '}
                    <span className="admin-badge">{m.result || 'Upcoming'}</span>
                  </h4>
                  <p>
                    {m.match_date ? new Date(m.match_date).toLocaleString() : 'TBD'} •{' '}
                    {m.venue || 'Venue TBD'}
                  </p>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn-sm btn-edit"
                    onClick={() =>
                      setMatchForm({
                        ...m,
                        match_date: m.match_date
                          ? new Date(m.match_date).toISOString().slice(0, 16)
                          : '',
                        venue: m.venue ?? '',
                        result: m.result ?? '',
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-del"
                    onClick={() => handleDelete('matches', m.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'gallery' && (
        <div className="admin-panel">
          <form className="admin-form-card" onSubmit={saveGallery}>
            <h2>Upload Action Photo</h2>
            <label>Select Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label>Or Paste Image URL</label>
            <input
              placeholder="https://..."
              value={galleryForm.image_url}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, image_url: e.target.value })
              }
            />
            <label>Caption</label>
            <input
              placeholder="e.g. Inter-Collegiate Finals 2026"
              value={galleryForm.caption}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, caption: e.target.value })
              }
            />
            {status && <p className="admin-msg">{status}</p>}
            <button type="submit" className="btn btn-gold auth-btn" disabled={saving}>
              {saving ? 'Uploading...' : 'Add to Gallery'}
            </button>
          </form>

          <div className="admin-list">
            {gallery.length === 0 && <p>No gallery photos yet.</p>}
            {gallery.map((g) => (
              <div key={g.id} className="admin-item">
                <div className="admin-item-info">
                  <img
                    src={g.image_url}
                    alt={g.caption || 'Gallery'}
                    className="admin-thumb"
                  />
                  <div>
                    <h4>{g.caption || 'Team Photo'}</h4>
                    <p>{new Date(g.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn-sm btn-del"
                    onClick={() => handleDelete('gallery', g.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'enquiries' && (
        <div className="admin-list">
          {status && <p className="admin-msg" style={{ color: 'var(--navy)', background: '#fff4d6' }}>{status}</p>}
          {enquiries.length === 0 && <p>No enquiries submitted yet.</p>}
          {enquiries.map((enq) => (
            <div key={enq.id} className="admin-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h4>
                    {enq.sender_name}
                    <span className="admin-badge">
                      {(enq.enquiry_replies && enq.enquiry_replies.length > 0) || enq.status === 'answered' ? 'Answered' : 'Open'}
                    </span>
                  </h4>
                  <p>
                    {enq.subject || 'General Enquiry'} • {new Date(enq.created_at).toLocaleString()}
                    {enq.sender_email ? ` • ${enq.sender_email}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-sm btn-del"
                  onClick={() => handleDelete('enquiries', enq.id)}
                >
                  Delete
                </button>
              </div>
              <p style={{ marginTop: 8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{enq.message}</p>
              {enq.enquiry_replies && enq.enquiry_replies.length > 0 && (
                <div style={{ marginTop: 10, paddingLeft: 12, borderLeft: '3px solid var(--gold)', display: 'grid', gap: 6 }}>
                  {enq.enquiry_replies.map((r) => (
                    <div key={r.id} style={{ fontSize: '0.9rem' }}>
                      <strong>{r.admin_name}:</strong> {r.reply_text}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(11,31,75,0.2)' }}
                  placeholder="Write an admin reply..."
                  value={replyDrafts[enq.id] || ''}
                  onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [enq.id]: e.target.value }))}
                />
                <button
                  type="button"
                  className="btn-sm btn-edit"
                  disabled={saving || !(replyDrafts[enq.id] || '').trim()}
                  onClick={() => saveEnquiryReply(enq.id)}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}