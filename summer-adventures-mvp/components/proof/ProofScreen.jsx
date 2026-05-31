"use client";

import { useRef, useState, useEffect } from "react";

export default function ProofScreen({ activity: initialActivity = "", onProofReady }) {
  const [activity, setActivity] = useState(initialActivity);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialActivity) {
      setActivity(initialActivity);
    }
  }, [initialActivity]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      onProofReady?.(activity, base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-container">
      <h1>Prove It!</h1>

      <div className="input-group">
        <label htmlFor="proof-activity">Activity name</label>
        <input
          id="proof-activity"
          type="text"
          placeholder="What did you do?"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="cta-button"
        style={{ marginBottom: "0.75rem", background: "var(--secondary)" }}
        onClick={() => fileInputRef.current?.click()}
        disabled={!activity.trim()}
      >
        Upload Photo
      </button>

      {fileName && (
        <p style={{ fontSize: "0.875rem", marginBottom: 0, textAlign: "center" }}>
          Selected: {fileName}
        </p>
      )}
    </div>
  );
}
