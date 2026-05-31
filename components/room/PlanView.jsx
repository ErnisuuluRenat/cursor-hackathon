export default function PlanView({ plan, onNext }) {
  if (!plan) return <div>Loading plan...</div>;

  return (
    <div className="plan-view">
      <h1>Your Trip Plan</h1>

      <div className="plan-section">
        <h3>📦 What to Bring:</h3>
        <ul>
          {plan.packingList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="plan-section">
        <h3>📅 Best Day: {plan.bestDay}</h3>
      </div>

      <div className="plan-section">
        <h3>🗺️ Steps:</h3>
        <ol>
          {plan.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <button className="cta-button" onClick={onNext}>
        We Did It! 🎉
      </button>
    </div>
  );
}
