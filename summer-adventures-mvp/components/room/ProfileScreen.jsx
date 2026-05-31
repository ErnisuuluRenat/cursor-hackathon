"use client";

export default function ProfileScreen({ username = "Elnura", elo = 1320, completedTrips = 3 }) {
  // Badges logic based on ELO score
  const badgeLevel = elo >= 1400 ? "Elite Nomad 🏆" : elo >= 1200 ? "Wanderer ⛺" : "Beginner Explorer 🌲";
  const nextLevelElo = elo >= 1400 ? 2000 : 1400;
  const progressPercent = Math.min(100, Math.round(((elo - 800) / (nextLevelElo - 800)) * 100));

  return (
    <div className="app-container" style={{ position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        👤 Profile (profile)
      </h2>

      {/* Profile Details Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          background: "rgba(255, 255, 255, 0.02)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            boxShadow: "0 0 25px rgba(20, 184, 166, 0.3)",
            border: "3px solid #ffffff",
          }}
        >
          😎
        </div>

        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem" }}>{username}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 0 }}>
            {badgeLevel}
          </p>
        </div>
      </div>

      {/* Progress to Next Rank */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          <span>Current ELO: {Math.round(elo)}</span>
          <span>Next Rank: {nextLevelElo} ELO</span>
        </div>
        {/* Progress Bar background */}
        <div
          style={{
            width: "100%",
            height: "12px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "9999px",
            overflow: "hidden",
            border: "1px solid var(--glass-border)",
          }}
        >
          {/* Active progress */}
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
              borderRadius: "9999px",
              boxShadow: "0 0 10px var(--secondary)",
            }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="badge-grid">
        <div className="badge-item">
          <div className="badge-icon">🔥</div>
          <div className="badge-value">{completedTrips}</div>
          <div className="badge-label">Adventures</div>
        </div>
        <div className="badge-item">
          <div className="badge-icon">⚡</div>
          <div className="badge-value">{Math.round(elo)}</div>
          <div className="badge-label">ELO Score</div>
        </div>
        <div className="badge-item">
          <div className="badge-icon">🛡️</div>
          <div className="badge-value">Active</div>
          <div className="badge-label">Status</div>
        </div>
      </div>
    </div>
  );
}
