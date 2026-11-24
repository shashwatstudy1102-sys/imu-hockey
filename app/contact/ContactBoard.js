'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactBoard({
  initialEnquiries = [],
  initialError = '',
  isAdmin = false,
  adminName = 'Team Admin',
  adminId = null,
}) {
  const supabase = createClient()
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [filter, setFilter] = useState('all')

  const [form, setForm] = useState({
    sender_name: '',
    sender_email: '',
    subject: 'General Enquiry',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const [replyDrafts, setReplyDrafts] = useState({})
  const [replyingId, setReplyingId] = useState(null)
  const [boardError, setBoardError] = useState(initialError)

  async function refreshEnquiries() {
    const { data, error } = await supabase
      .from('enquiries')
      .select(
        'id, sender_name, subject, message, status, created_at, enquiry_replies(id, admin_name, reply_text, created_at)'
      )
      .order('created_at', { ascending: false })

    if (error) {
      setBoardError(error.message)
      return
    }
    setBoardError('')
    const normalized = (data || []).map((item) => ({
      ...item,
      enquiry_replies: (item.enquiry_replies || []).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      ),
    }))
    setEnquiries(normalized)
  }

  async function handleSubmitEnquiry(e) {
    e.preventDefault()
    if (!form.sender_name.trim() || !form.message.trim()) return

    setSubmitting(true)
    setFeedback({ type: '', text: '' })

    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          sender_name: form.sender_name.trim(),
          sender_email: form.sender_email.trim() || null,
          subject: form.subject.trim() || 'General Enquiry',
          message: form.message.trim(),
          status: 'open',
        },
      ])
      if (error) throw error

      setForm({
        sender_name: '',
        sender_email: '',
        subject: 'General Enquiry',
        message: '',
      })
      setFeedback({
        type: 'ok',
        text: 'Your enquiry has been posted! An admin will respond here shortly.',
      })
      await refreshEnquiries()
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err.message || 'Could not submit enquiry. Please try again.',
      })
    }
    setSubmitting(false)
  }

  async function handlePostReply(enquiryId) {
    const text = (replyDrafts[enquiryId] || '').trim()
    if (!text) return

    setReplyingId(enquiryId)
    try {
      const { error: replyErr } = await supabase.from('enquiry_replies').insert([
        {
          enquiry_id: enquiryId,
          admin_id: adminId,
          admin_name: adminName || 'Team Admin',
          reply_text: text,
        },
      ])
      if (replyErr) throw replyErr

      await supabase
        .from('enquiries')
        .update({ status: 'answered' })
        .eq('id', enquiryId)

      setReplyDrafts((prev) => ({ ...prev, [enquiryId]: '' }))
      await refreshEnquiries()
    } catch (err) {
      setBoardError(err.message)
    }
    setReplyingId(null)
  }

  async function handleDeleteEnquiry(enquiryId) {
    if (!confirm('Delete this enquiry and all its replies?')) return
    const { error } = await supabase.from('enquiries').delete().eq('id', enquiryId)
    if (error) setBoardError(error.message)
    else await refreshEnquiries()
  }

  async function handleDeleteReply(replyId) {
    if (!confirm('Delete this admin response?')) return
    const { error } = await supabase.from('enquiry_replies').delete().eq('id', replyId)
    if (error) setBoardError(error.message)
    else await refreshEnquiries()
  }

  const visibleEnquiries = enquiries.filter((item) => {
    const hasReplies = (item.enquiry_replies || []).length > 0
    if (filter === 'answered') return hasReplies || item.status === 'answered'
    if (filter === 'open') return !hasReplies && item.status !== 'answered'
    return true
  })

  return (
    <div className="contact-grid">
      <form className="contact-form-card" onSubmit={handleSubmitEnquiry}>
        <h2>Send an Enquiry</h2>
        <p className="contact-form-note">
          Questions about team trials, friendly matches, or campus hockey? Post your
          enquiry below and our team admins will reply publicly in the comment thread.
        </p>

        <label htmlFor="sender_name">Your Name *</label>
        <input
          id="sender_name"
          required
          placeholder="e.g. Cadet Arjun Roy"
          value={form.sender_name}
          onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
        />

        <label htmlFor="sender_email">Email (Optional, kept private to admins)</label>
        <input
          id="sender_email"
          type="email"
          placeholder="you@example.com"
          value={form.sender_email}
          onChange={(e) => setForm({ ...form, sender_email: e.target.value })}
        />

        <label htmlFor="subject">Topic</label>
        <select
          id="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        >
          <option value="General Enquiry">General Enquiry</option>
          <option value="Team Trials & Selection">Team Trials &amp; Selection</option>
          <option value="Friendly Match / Tournament">Friendly Match / Tournament</option>
          <option value="Equipment & Practice Schedule">Equipment &amp; Practice Schedule</option>
          <option value="Alumni / Media">Alumni / Media</option>
        </select>

        <label htmlFor="message">Enquiry Message *</label>
        <textarea
          id="message"
          required
          rows={4}
          placeholder="Write your question or message here..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        {feedback.text && (
          <p
            className={`contact-alert ${
              feedback.type === 'ok' ? 'contact-alert-ok' : 'contact-alert-err'
            }`}
          >
            {feedback.text}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-gold contact-submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Enquiry'}
        </button>
      </form>

      <div>
        <div className="board-header">
          <h2>Enquiries &amp; Admin Responses ({visibleEnquiries.length})</h2>
          <div className="board-filters">
            {[
              { id: 'all', label: 'All' },
              { id: 'open', label: 'Awaiting Reply' },
              { id: 'answered', label: 'Answered' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {boardError && (
          <p className="contact-alert contact-alert-err" style={{ marginBottom: 16 }}>
            Database notice: {boardError}. Make sure you have run{' '}
            <code>supabase_enquiries.sql</code> in your Supabase SQL Editor.
          </p>
        )}

        {visibleEnquiries.length === 0 ? (
          <div className="empty-board">
            <p>No enquiries in this view yet. Be the first to ask a question!</p>
          </div>
        ) : (
          <div className="enquiry-list">
            {visibleEnquiries.map((item) => {
              const replies = item.enquiry_replies || []
              const isAnswered = replies.length > 0 || item.status === 'answered'

              return (
                <article
                  key={item.id}
                  className={`enquiry-card ${isAnswered ? 'answered' : ''}`}
                >
                  <div className="enquiry-top">
                    <div>
                      <h3 className="enquiry-author">{item.sender_name}</h3>
                      <p className="enquiry-meta">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="enquiry-badges">
                      <span
                        className={`status-badge ${
                          isAnswered ? 'status-answered' : 'status-open'
                        }`}
                      >
                        {isAnswered ? 'Answered' : 'Open'}
                      </span>
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn-mini-del"
                          onClick={() => handleDeleteEnquiry(item.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {item.subject && (
                    <span className="enquiry-subject">{item.subject}</span>
                  )}

                  <p className="enquiry-message">{item.message}</p>

                  {replies.length > 0 && (
                    <div className="reply-thread">
                      {replies.map((r) => (
                        <div key={r.id} className="reply-bubble">
                          <div className="reply-head">
                            <span className="reply-admin-name">
                              {r.admin_name || 'Team Admin'}
                              <span className="admin-tag">Official Admin</span>
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="enquiry-meta">
                                {new Date(r.created_at).toLocaleString()}
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  className="btn-mini-del"
                                  onClick={() => handleDeleteReply(r.id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="reply-text">{r.reply_text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="reply-box">
                      <textarea
                        rows={2}
                        placeholder="Write an official admin response..."
                        value={replyDrafts[item.id] || ''}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                      />
                      <div className="reply-box-actions">
                        <button
                          type="button"
                          className="btn-reply"
                          disabled={
                            replyingId === item.id ||
                            !(replyDrafts[item.id] || '').trim()
                          }
                          onClick={() => handlePostReply(item.id)}
                        >
                          {replyingId === item.id ? 'Posting...' : 'Post Admin Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
