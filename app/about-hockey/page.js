export const metadata = {
  title: 'About Field Hockey & Rules | IMU Kolkata Hockey Team',
  description: 'Complete guide to Field Hockey, pitch dimensions, official FIH rules, set pieces, and tactical formations.',
}

export default function AboutHockeyPage() {
  const specs = [
    { value: '11 v 11', label: 'Players on Turf (10 Outfield + 1 GK)' },
    { value: '60 Mins', label: '4 Quarters × 15 Minutes Each' },
    { value: '91.4m × 55m', label: 'Standard International Turf Size' },
    { value: '14.63m', label: 'Shooting Circle ("D") Radius' },
  ]

  const coreRules = [
    {
      title: '1. Flat Side Only',
      desc: 'Players may only strike, push, or control the ball with the flat left-hand side of the hockey stick. Using the rounded back side of the stick or any part of the body/feet to stop or propel the ball is a foul.',
    },
    {
      title: '2. Scoring Inside the "D"',
      desc: 'A field goal counts only if the ball is struck or deflected by an attacker’s stick while inside the 14.63-metre Shooting Circle ("D"). A shot hit from outside the circle that goes straight in does not count.',
    },
    {
      title: '3. No Obstruction (Shielding)',
      desc: 'Players cannot use their body, shoulders, or stick to block an opponent from reaching the ball. All tackles must be clean attempts to play the ball without physical charging or tripping.',
    },
    {
      title: '4. Dangerous Play & High Balls',
      desc: 'Lifting the ball dangerously into a crowd of players or hitting into an opponent at close range is penalized. Controlled aerial passes into open space are legal provided the landing zone is clear.',
    },
    {
      title: '5. Free Hits & Self-Pass',
      desc: 'Minor fouls outside the circle result in a Free Hit. Under modern FIH rules, the taker may execute a "self-pass" (dribbling immediately) without passing to a teammate first, though the ball must travel 5 metres before entering the circle.',
    },
    {
      title: '6. Rolling Substitutions',
      desc: 'Teams carry up to 16 players (11 on pitch, 5 on bench) and can make unlimited rolling substitutions at any time during play—except during a Penalty Corner—keeping match tempo relentlessly fast.',
    },
  ]

  const setPieces = [
    {
      title: 'Penalty Corner (PC)',
      desc: 'Awarded when a defender commits a foul inside the Shooting Circle or deliberately sends the ball over the backline. One attacker injects the ball from the backline to teammates outside the "D", who must stop it outside the circle before firing a drag-flick or hit at goal against 5 rushing defenders.',
    },
    {
      title: 'Penalty Stroke',
      desc: 'Awarded for a deliberate foul inside the "D" or a foul that prevents a certain goal. Taken 1-on-1 from the 6.4-metre spot against the goalkeeper using a push, flick, or scoop (no hitting allowed).',
    },
    {
      title: 'Long Corner (23m Restart)',
      desc: 'Awarded when the ball goes unintentionally over the backline off a defender’s stick or pads. Play restarts with a free hit on the 23-metre line directly inline with where the ball crossed.',
    },
  ]

  const positions = [
    {
      title: 'Forwards (Strikers & Wingers)',
      desc: 'Lead the high press, stretch defenders along the sidelines, create circle penetrations, and execute rapid deflections inside the "D".',
    },
    {
      title: 'Midfielders (Center & Halfbacks)',
      desc: 'The engine room of the team—linking defence to attack, controlling tempo, distributing aerial and through passes, and tracking back on transitions.',
    },
    {
      title: 'Defenders (Fullbacks & Sweepers)',
      desc: 'Guard the Shooting Circle, intercept circle entries, initiate structured outlets from the backline, and serve as primary drag-flickers on Penalty Corners.',
    },
    {
      title: 'Goalkeeper',
      desc: 'Equipped with helmet, chest guard, leg pads, and kickers; the only player allowed to use feet, pads, and body to clear the ball inside their own Shooting Circle.',
    },
  ]

  return (
    <section className="pub-section container">
      <p className="pub-kicker">The Sport & Official Rules</p>
      <h1 className="pub-title">Understanding Field Hockey</h1>
      <p className="pub-sub">
        From Olympic history and pitch dimensions to FIH rules, Penalty Corners, and tactical positions—everything cadets and supporters need to know about the game.
      </p>

      {/* Quick Specs */}
      <div className="info-stats-grid">
        {specs.map((s) => (
          <div key={s.label} className="info-stat-card">
            <div className="info-stat-val">{s.value}</div>
            <div className="info-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overview & Indian Legacy */}
      <div className="info-block">
        <h2>About The Game</h2>
        <p className="info-lead">
          Field Hockey is one of the fastest, most technically demanding team sports in the world, governed internationally by the <strong>International Hockey Federation (FIH)</strong> and nationally by <strong>Hockey India</strong>. Played on watered synthetic turf for maximum ball speed, modern hockey blends endurance, split-second stick skills, and fluid positional rotation. For India, hockey holds unmatched sporting prestige—backed by <strong>8 Olympic Gold Medals</strong> and a rich inter-collegiate tradition across premier maritime and engineering institutions like IMU Kolkata Campus (DMET).
        </p>
      </div>

      {/* Core Rules */}
      <div className="info-block">
        <h2>Essential Rules of Play</h2>
        <div className="rules-grid">
          {coreRules.map((rule) => (
            <div key={rule.title} className="rule-card">
              <h3>{rule.title}</h3>
              <p>{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Set Pieces */}
      <div className="info-block">
        <h2>Key Set Pieces</h2>
        <div className="rules-grid">
          {setPieces.map((sp) => (
            <div key={sp.title} className="rule-card">
              <h3>{sp.title}</h3>
              <p>{sp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card Sanctions */}
      <div className="info-block">
        <h2>Umpire Card Sanctions</h2>
        <div className="card-badges">
          <div className="sanction-pill sanction-green">
            <strong>Green Card (2-Minute Suspension):</strong> Official warning for minor infractions such as time-wasting, failing to retreat 5 metres on a free hit, or dissent.
          </div>
          <div className="sanction-pill sanction-yellow">
            <strong>Yellow Card (5 to 10-Minute Suspension):</strong> Temporary suspension for repeated minor fouls or serious physical/dangerous infractions.
          </div>
          <div className="sanction-pill sanction-red">
            <strong>Red Card (Permanent Expulsion):</strong> Player is sent off for the remainder of the match for severe misconduct, leaving their team a player down.
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="info-block">
        <h2>Field Positions & Roles</h2>
        <div className="rules-grid">
          {positions.map((pos) => (
            <div key={pos.title} className="rule-card">
              <h3>{pos.title}</h3>
              <p>{pos.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}