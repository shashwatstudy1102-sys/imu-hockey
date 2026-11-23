import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'
import '../auth.css'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <section className="auth-wrap">
        <div className="auth-card">
          <h1>No Access</h1>
          <p className="auth-sub">
            You are signed in as {user.email}, but this account is not an admin. Please
            contact the team manager.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-wrap container">
      <p className="auth-kicker">Admin Dashboard</p>
      <h1>Welcome{profile.full_name ? `, ${profile.full_name}` : ''}</h1>
      <p className="auth-sub">Signed in as {user.email}</p>
      <AdminDashboard />
    </section>
  )
}