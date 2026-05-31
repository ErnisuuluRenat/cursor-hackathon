"use client";

export default function LobbyScreen({ activeRooms = [], onNavigate }) {
  return (
    <div className="app-container">
      <h2 style={{ textAlign: "center", marginBottom: "0.25rem", fontSize: "1.6rem" }}>
        🌴 Summer ELO Tracker
      </h2>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--secondary)", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Lobby (главная)
      </p>

      {/* Daily Challenge Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.05) 100%)",
          border: "1px solid var(--secondary)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 15px rgba(20, 184, 166, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>⚡</span>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff" }}>
            Daily Epic Challenge
          </h3>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: "1.4", marginBottom: "0.75rem" }}>
          Hike more than 1500m elevation. Post photo proof to receive a **+50 ELO bonus**!
        </p>
        <button
          onClick={() => onNavigate("создай свой ивент")}
          style={{
            background: "var(--secondary)",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Plan Now
        </button>
      </div>

      {/* Active Squad Adventures */}
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#ffffff" }}>
        Active Adventures
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
        {activeRooms.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem 0" }}>
            No adventures yet. Tap &quot;создай свой ивент&quot; to plan one!
          </p>
        ) : (
          activeRooms.map((room) => (
          <div
            key={room.id}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>{room.name}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.15rem 0 0" }}>
                Crew: {room.members}
              </p>
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: room.status === "In Planning" ? "var(--secondary)" : room.status === "Completed" ? "#22c55e" : "var(--primary)",
                background: room.status === "In Planning" ? "rgba(20, 184, 166, 0.1)" : room.status === "Completed" ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 107, 107, 0.1)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              {room.status}
            </span>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
