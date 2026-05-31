"use client";

export default function VerdictCard({ verdict, onViewLeaderboard, t }) {
  if (!verdict) return null;

  const verified = verdict.verified;
  const statusColor = verified ? "#22c55e" : "#ef4444";
  const statusLabel = verified ? t("verified") : t("notVerified");

  return (
    <div className="app-container">
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          color: statusColor,
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        {statusLabel}
      </p>

      <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>{verdict.reason}</p>

      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          padding: "1.25rem",
          borderRadius: "var(--radius)",
          background: "var(--bg)",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.25rem",
            color: "var(--text-muted)",
          }}
        >
          {t("coolnessScore")}
        </p>
        <p
          style={{
            fontSize: "clamp(2.5rem, 10vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--primary)",
            marginBottom: 0,
          }}
        >
          {verdict.coolnessScore}
          <span style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}>/100</span>
        </p>
      </div>

      <button type="button" className="cta-button" onClick={onViewLeaderboard}>
        {t("seeLeaderboardBtn")}
      </button>
    </div>
  );
}
