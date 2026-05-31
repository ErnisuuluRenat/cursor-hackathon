"use client";

import { useState } from "react";

const MOCK_FRIENDS = [
  { id: "1", name: "Alex" },
  { id: "2", name: "Jordan" },
  { id: "3", name: "Sam" },
  { id: "4", name: "Riley" },
];

export default function RoomScreen({ onPlanReady, t }) {
  const [activity, setActivity] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleMember = (friend) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === friend.id)
        ? prev.filter((m) => m.id !== friend.id)
        : [...prev, friend]
    );
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      await onPlanReady?.(activity, selectedMembers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>{t("roomTitle")}</h1>

      <div className="input-group">
        <label htmlFor="activity">{t("roomActivityLabel")}</label>
        <input
          id="activity"
          type="text"
          placeholder={t("roomActivityPlaceholder")}
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          disabled={loading}
        />
      </div>

      <fieldset className="input-group" style={{ border: "none" }}>
        <legend style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          {t("roomWhoComing")}
        </legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {MOCK_FRIENDS.map((friend) => {
            const selected = selectedMembers.some((m) => m.id === friend.id);
            return (
              <button
                key={friend.id}
                type="button"
                onClick={() => toggleMember(friend)}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  border: `2px solid ${selected ? "var(--secondary)" : "transparent"}`,
                  background: selected ? "var(--secondary)" : "var(--bg)",
                  color: selected ? "#ffffff" : "var(--text)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {friend.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        className="cta-button"
        onClick={handleGeneratePlan}
        disabled={loading || !activity.trim()}
      >
        {loading ? t("generatingPlanBtn") : t("generatePlanBtn")}
      </button>
    </div>
  );
}
