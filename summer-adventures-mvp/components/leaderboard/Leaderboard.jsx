"use client";

import { useState } from "react";

function isImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

function PlayerAvatar({ player }) {
  const [imageFailed, setImageFailed] = useState(false);
  const emojiOrLetter =
    player.avatar && !isImageUrl(player.avatar)
      ? player.avatar
      : (player.name?.charAt(0)?.toUpperCase() ?? "?");

  const circleStyle = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isImageUrl(player.avatar) ? "0.875rem" : "1.125rem",
    fontWeight: 700,
    flexShrink: 0,
    overflow: "hidden",
  };

  if (isImageUrl(player.avatar) && !imageFailed) {
    return (
      <img
        src={player.avatar}
        alt=""
        width={32}
        height={32}
        onError={() => setImageFailed(true)}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }

  return <span style={circleStyle}>{emojiOrLetter}</span>;
}

export default function Leaderboard({ players = [] }) {
  const sortedPlayers = [...players].sort(
    (a, b) => (b.elo ?? 0) - (a.elo ?? 0)
  );

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
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id ?? player.name ?? index}
                style={{
                  background:
                    index === 0
                      ? "color-mix(in srgb, var(--secondary) 20%, white)"
                      : "transparent",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
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
                    <PlayerAvatar player={player} />
                    <span style={{ fontWeight: index === 0 ? 700 : 400 }}>
                      {player.name}
                    </span>
                  </span>
                </td>
                <td style={cellStyle}>{Math.round(player.elo ?? 0)}</td>
                <td style={cellStyle}>
                  {player.adventures ?? player.completedTrips ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedPlayers.length === 0 && (
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
