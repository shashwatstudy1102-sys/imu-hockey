import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <section className="pub-section container">
      <p className="pub-kicker">Action & Moments</p>
      <h1 className="pub-title">Team Gallery</h1>
      <p className="pub-sub">
        Match highlights, training sessions, and tournament memories from the field.
      </p>

      {!photos || photos.length === 0 ? (
        <p className="pub-sub">No photos uploaded yet. Upload action photos from the Admin Dashboard.</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="gallery-card">
              <img src={photo.image_url} alt={photo.caption || 'IMU Hockey'} />
              {photo.caption && <div className="gallery-caption">{photo.caption}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}