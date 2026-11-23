export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hockey stick crossed with a ship anchor">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>
        <linearGradient id="ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8fb4ff" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="205" r="170" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 10" />

      {/* Anchor */}
      <g fill="none" stroke="url(#ice)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="200" cy="62" r="22" />
        <line x1="200" y1="84" x2="200" y2="335" />
        <line x1="150" y1="118" x2="250" y2="118" />
        <path d="M95 255 C95 330 150 352 200 352 C250 352 305 330 305 255" />
        <path d="M75 272 L95 245 L120 275" />
        <path d="M325 272 L305 245 L280 275" />
      </g>

      {/* Hockey stick */}
      <g fill="none" stroke="url(#gold)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M335 28 L178 318 Q168 342 138 346 L82 346" strokeWidth="18" />
        <path d="M322 52 L312 70 M308 78 L298 96" stroke="#0b1f4b" strokeWidth="18" />
      </g>
      <path d="M335 28 L178 318 Q168 342 138 346 L82 346" fill="none" stroke="#071433" strokeWidth="4" strokeLinecap="round" opacity="0.35" />

      {/* Ball */}
      <circle cx="52" cy="344" r="15" fill="#fff" />
      <circle cx="52" cy="344" r="15" fill="none" stroke="#c9a227" strokeWidth="3" />
    </svg>
  )
}
