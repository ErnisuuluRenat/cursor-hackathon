export default function VerdictCard({ verdict, onViewLeaderboard }) {
  if (!verdict) return <div>Loading verdict...</div>;

  const coolnessColor = verdict.coolnessScore > 70 ? 'green' : verdict.coolnessScore > 40 ? 'orange' : 'red';

  return (
    <div className="verdict-card">
      <h1>✨ AI Verdict</h1>

      <div className={`verdict-result ${verdict.verified ? 'verified' : 'unverified'}`}>
        <h2>{verdict.verified ? '✅ VERIFIED' : '❌ NOT VERIFIED'}</h2>
        <p>{verdict.reason}</p>
      </div>

      <div className={`coolness-score ${coolnessColor}`}>
        <h2>Coolness Score</h2>
        <div className="score-display">{verdict.coolnessScore}/100</div>
      </div>

      <button className="cta-button" onClick={onViewLeaderboard}>
        See Leaderboard 🏆
      </button>
    </div>
  );
}
