"use client";

export default function PlanView({ plan, onNext, t }) {
  if (!plan) return null;

  return (
    <div className="app-container">
      <h1>{t("planTitle")}</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("whatToBring")}</h2>
        <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
          {plan.packingList?.map((item, index) => (
            <li key={index} style={{ marginBottom: "0.25rem" }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("bestDay")}</h2>
        <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>{plan.bestDay}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{t("steps")}</h2>
        <ol style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
          {plan.steps?.map((step, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <button type="button" className="cta-button" onClick={onNext}>
        {t("weDidItBtn")}
      </button>
    </div>
  );
}
