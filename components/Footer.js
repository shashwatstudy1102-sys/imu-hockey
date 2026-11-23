export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-title">
          Indian Maritime University, Kolkata Campus Hockey Team
        </p>
        <p>Erstwhile DMET &bull; Erstwhile MERI</p>
        <p className="footer-small">
          &copy; {new Date().getFullYear()} IMU Kolkata Campus Hockey Team. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
