export default function Leaderboard({ players }) {
  if (!players || players.length === 0) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h1>🏆 Leaderboard</h1>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>ELO</th>
            <th>Adventures</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, i) => (
            <tr key={player.id} className={i === 0 ? 'leader' : ''}>
              <td>#{i + 1}</td>
              <td>{player.avatar} {player.name}</td>
              <td className="elo">{Math.round(player.elo)}</td>
              <td>{player.completedTrips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
