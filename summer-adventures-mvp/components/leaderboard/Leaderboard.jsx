export default function Leaderboard({ players = [] }) {
  return (
    <div className="app-container">
      <h1>Leaderboard</h1>

      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9375rem",
          }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>Rank</th>
              <th style={{ ...headerCellStyle, textAlign: "left" }}>Player</th>
              <th style={headerCellStyle}>ELO</th>
              <th style={headerCellStyle}>Adventures</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.id ?? player.name ?? index}
                style={{
                  background: index === 0 ? "color-mix(in srgb, var(--secondary) 20%, white)" : "transparent",
                  borderBottom: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
                }}
              >
                <td style={{ ...cellStyle, fontWeight: 700 }}>{index + 1}</td>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt=""
                        width={32}
                        height={32}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--primary)",
                          color: "#ffffff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {player.name?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    )}
                    <span style={{ fontWeight: index === 0 ? 700 : 400 }}>{player.name}</span>
                  </span>
                </td>
                <td style={cellStyle}>{player.elo}</td>
                <td style={cellStyle}>{player.adventures ?? player.completedTrips ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {players.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "1rem", marginBottom: 0 }}>
            No players yet.
          </p>
        )}
      </div>
    </div>
  );
}

const headerCellStyle = {
  padding: "0.75rem 0.5rem",
  fontWeight: 700,
  textAlign: "center",
  color: "var(--text-muted)",
  fontSize: "0.8125rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "2px solid color-mix(in srgb, var(--text) 15%, transparent)",
};

const cellStyle = {
  padding: "0.875rem 0.5rem",
  textAlign: "center",
  verticalAlign: "middle",
};
