'use client';
import { useRef, useState } from 'react';

export default function ProofScreen({ onProofReady }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState('Japan trip');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      await onProofReady(activity, base64);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="proof-screen">
      <h1>Prove You Did It!</h1>

      <div className="input-group">
        <label>What activity did you do?</label>
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Activity name"
        />
      </div>

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className="upload-button cta-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? '⏳ Verifying...' : '📸 Upload Photo'}
        </button>
      </div>
    </div>
  );
}
