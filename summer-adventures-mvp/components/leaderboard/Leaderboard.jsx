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
    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
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

      <div style={{ overflowX: "auto" }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Rank</th>
              <th style={{ textAlign: "left" }}>Player</th>
              <th style={{ textAlign: "center" }}>ELO</th>
              <th style={{ textAlign: "center" }}>Adventures</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id ?? player.name ?? index}
                className={index === 0 ? "leader-row" : undefined}
              >
                <td className="rank-cell" style={{ textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ textAlign: "left" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <PlayerAvatar player={player} />
                    <span className="player-name">{player.name}</span>
                  </span>
                </td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>
                  {Math.round(player.elo ?? 0)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {player.adventures ?? player.completedTrips ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedPlayers.length === 0 && (
          <p className="leaderboard-empty">No players yet.</p>
        )}
      </div>
    </div>
  );
}
