"use client";

export default function HitsScreen() {
  const epicHits = [
    { id: 1, activity: "Japan Trip", reason: "AI verified incredible photo inside Shibuya crossing! Legendary journey.", score: 92, status: "VERIFIED ✅", icon: "🇯🇵" },
    { id: 2, activity: "Skydiving Almaty", reason: "Stunning vision validation. Ultimate adrenaline rush at 4000m.", score: 88, status: "VERIFIED ✅", icon: "🪂" },
    { id: 3, activity: "Hiking in Peak Furmanov", reason: "Great scenery, validated hiking shoes & trail markings.", score: 79, status: "VERIFIED ✅", icon: "⛰️" },
    { id: 4, activity: "Midnight Volleyball", reason: "Sunset play with 6 friends. AI scored high for epic lighting.", score: 75, status: "VERIFIED ✅", icon: "🏐" },
  ];

  return (
    <div className="app-container">
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        🔥 Legendary Hits (Хиты)
      </h2>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Highest rated adventures completed by the squad. Climb the ELO with high scores!
      </p>

      {/* Masonry/Grid of Hits */}
      <div className="hits-grid">
        {epicHits.map((hit) => (
          <div key={hit.id} className="hit-card">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span className="hit-tag" style={{ margin: 0 }}>Score: {hit.score}</span>
                <span style={{ fontSize: "1.5rem" }}>{hit.icon}</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
                {hit.activity}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4", marginBottom: 0 }}>
                {hit.reason}
              </p>
            </div>
            
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span>{hit.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
