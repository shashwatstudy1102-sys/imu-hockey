'use client'
import { useEffect, useState } from 'react'

export default function HockeyLoader({ persistent = false }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (persistent) return
    const timer = setTimeout(() => setHidden(true), 1150)
    return () => clearTimeout(timer)
  }, [persistent])

  return (
    <div
      className={`dmet-loader-overlay ${hidden && !persistent ? 'fade-out' : ''}`}
      aria-label="Loading IMU Kolkata Hockey Portal"
    >
      <div className="dmet-emblem-box">
        {/* Rotating Maritime Compass Degree Ring */}
        <svg className="dmet-compass-ring" viewBox="0 0 180 180" fill="none">
          <circle
            cx="90"
            cy="90"
            r="82"
            stroke="#d4af37"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.75"
          />
          <circle
            cx="90"
            cy="90"
            r="72"
            stroke="#d4af37"
            strokeWidth="1"
            opacity="0.35"
          />
          {/* Cardinal Compass Ticks (N, E, S, W) */}
          <polygon points="90,2 86,12 94,12" fill="#d4af37" />
          <polygon points="90,178 86,168 94,168" fill="#d4af37" opacity="0.6" />
          <polygon points="2,90 12,86 12,94" fill="#d4af37" opacity="0.6" />
          <polygon points="178,90 168,86 168,94" fill="#d4af37" opacity="0.6" />
        </svg>

        {/* Crossed Hockey Sticks + Shooting Circle + Gliding Ball */}
        <svg className="dmet-sticks-svg" viewBox="0 0 120 120" fill="none">
          {/* Shooting Circle ("D") Arc */}
          <path
            d="M 24 88 A 38 38 0 0 1 96 88"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="5 4"
            opacity="0.45"
          />

          {/* Left-to-Right Hockey Stick */}
          <path
            d="M 32 22 L 80 84 C 84 89 92 88 94 82 C 95 78 91 75 88 77"
            stroke="#d4af37"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right-to-Left Hockey Stick */}
          <path
            d="M 88 22 L 40 84 C 36 89 28 88 26 82 C 25 78 29 75 32 77"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Turf Baseline */}
          <line
            x1="20"
            y1="96"
            x2="100"
            y2="96"
            stroke="#d4af37"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Animated Rolling Hockey Ball */}
          <circle
            className="dmet-hockey-ball"
            cx="60"
            cy="88"
            r="6"
            fill="#d4af37"
          />
        </svg>
      </div>

      <p className="dmet-loader-kicker">Est. 1949 • Kolkata Campus</p>
      <h2 className="dmet-loader-title">IMU Kolkata Hockey</h2>
      <p className="dmet-loader-sub">Erstwhile DMET • Erstwhile MERI</p>

      <div className="dmet-loader-track">
        <div className="dmet-loader-fill" />
      </div>
    </div>
  )
}