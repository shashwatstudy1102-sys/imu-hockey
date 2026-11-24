import { createClient } from '@/lib/supabase/server'
import ContactBoard from './ContactBoard'
import './contact.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Contact & Enquiries | IMU Kolkata Campus Hockey Team',
  description:
    'Send an enquiry to the IMU Kolkata Campus Hockey Team and view official admin responses.',
}

export default async function ContactPage() {
  let initialEnquiries = []
  let initialError = ''
  let isAdmin = false
  let adminName = 'Team Admin'
  let adminId = null

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        isAdmin = true
        adminId = user.id
        adminName = profile.full_name || user.email || 'Team Admin'
      }
    }

    const { data, error } = await supabase
      .from('enquiries')
      .select(
        'id, sender_name, subject, message, status, created_at, enquiry_replies(id, admin_name, reply_text, created_at)'
      )
      .order('created_at', { ascending: false })

    if (error) {
      initialError = error.message
    } else {
      initialEnquiries = (data || []).map((item) => ({
        ...item,
        enquiry_replies: (item.enquiry_replies || []).sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
      }))
    }
  } catch (err) {
    initialError = err?.message || 'Unable to connect to Supabase.'
  }

  return (
    <section className="pub-section container">
      <p className="pub-kicker">Contact &amp; Enquiry Desk</p>
      <h1 className="pub-title">Contact the Hockey Team</h1>
      <p className="pub-sub">
        Have a question about trials, match fixtures, or campus hockey? Submit your
        enquiry below — team admins respond directly in the public thread.
      </p>

      <ContactBoard
        initialEnquiries={initialEnquiries}
        initialError={initialError}
        isAdmin={isAdmin}
        adminName={adminName}
        adminId={adminId}
      />
    </section>
  )
}
