"use client";

import { useState, useEffect } from "react";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import ProofScreen from "@/components/proof/ProofScreen";
import VerdictCard from "@/components/proof/VerdictCard";
import PlanView from "@/components/room/PlanView";
import RoomScreen from "@/components/room/RoomScreen";

// Import our new premium revamped screens
import LobbyScreen from "@/components/room/LobbyScreen";
import HitsScreen from "@/components/room/HitsScreen";
import MapScreen from "@/components/room/MapScreen";
import ProfileScreen from "@/components/room/ProfileScreen";

const USE_MOCKS = false;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

const mockPlan = {
  packingList: ["Sunscreen", "Camera", "Passport"],
  bestDay: "Saturday",
  steps: ["Pack bags", "Meet at the station", "Adventure time!"],
};

const mockVerdict = {
  verified: true,
  reason: "Looks like a verified epic adventure!",
  coolnessScore: 85,
};

const mockLeaderboard = [
  {
    id: "1",
    name: "Alex",
    avatar: "😎",
    elo: 1420,
    completedTrips: 12,
  },
  {
    id: "2",
    name: "Jordan",
    avatar: "🧑",
    elo: 1385,
    completedTrips: 9,
  },
  {
    id: "3",
    name: "Sam",
    avatar: "👩",
    elo: 1310,
    completedTrips: 7,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("главная"); // "главная" | "Хиты" | "scoreboard" | "создай свой ивент" | "карта" | "profile"
  const [eventScreen, setEventScreen] = useState("room"); // "room" | "plan" | "proof" | "verdict"
  
  const [room, setRoom] = useState(null);
  const [plan, setPlan] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-fetch leaderboard data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/leaderboard/`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(Array.isArray(data) ? data : (data.players ?? []));
        }
      } catch (err) {
        console.error("Failed to load initial leaderboard", err);
      }
    };
    fetchInitialData();
  }, []);

  const handlePlanReady = async (activity, selectedMembers) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRoom({ activity, members: selectedMembers });
        setPlan(mockPlan);
        setEventScreen("plan");
      } else {
        const response = await fetch(`${API_BASE}/api/plan/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity,
            members: selectedMembers,
          }),
        });

        if (!response.ok) {
          throw new Error(`Plan request failed (${response.status})`);
        }

        const data = await response.json();
        setRoom({ activity, members: selectedMembers });
        setPlan(data);
        setEventScreen("plan");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleProofReady = async (activity, base64) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setVerdict(mockVerdict);
        setEventScreen("verdict");
      } else {
        const response = await fetch(`${API_BASE}/api/verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity,
            image: base64,
          }),
        });

        if (!response.ok) {
          throw new Error(`Verification failed (${response.status})`);
        }

        const data = await response.json();
        setVerdict(data);
        setEventScreen("verdict");
        
        // Auto-update stats and post score
        await fetch(`${API_BASE}/api/score/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: 1,
            coolnessScore: data.coolnessScore ?? 60
          })
        });

        // Re-fetch leaderboard to reflect fresh ELO
        const lbResponse = await fetch(`${API_BASE}/api/leaderboard/`);
        if (lbResponse.ok) {
          const lbData = await lbResponse.json();
          setLeaderboard(Array.isArray(lbData) ? lbData : (lbData.players ?? []));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify proof.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLeaderboard(mockLeaderboard);
        setActiveTab("scoreboard");
      } else {
        const response = await fetch(`${API_BASE}/api/leaderboard/`);

        if (!response.ok) {
          throw new Error(`Leaderboard request failed (${response.status})`);
        }

        const data = await response.json();
        setLeaderboard(Array.isArray(data) ? data : (data.players ?? []));
        setActiveTab("scoreboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  // Find player "You" to pass stats dynamically
  const activeUser = leaderboard.find(p => p.id === 1) || { name: "You", elo: 1320, completedTrips: 3 };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Top Utility Header Bar */}
      <div className="wireframe-topbar">
        <button
          className={`topbar-btn ${activeTab === "карта" ? "active" : ""}`}
          onClick={() => setActiveTab("карта")}
        >
          🗺️ карта
        </button>

        <div className="search-bar-container">
          <input
            className="search-bar-input"
            type="text"
            placeholder="🔍 search bar..."
            disabled
          />
        </div>

        <button
          className={`topbar-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 profile
        </button>
      </div>

      {error && (
        <div
          className="app-container"
          style={{
            marginBottom: "1rem",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {loading && activeTab !== "главная" && (
        <div className="app-container">
          <p style={{ textAlign: "center", margin: 0 }}>Gathering cosmic ideas...</p>
        </div>
      )}

      {/* Main Container Views based on active tab selection */}
      {!loading && (
        <>
          {activeTab === "главная" && (
            <LobbyScreen onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === "Хиты" && (
            <HitsScreen />
          )}

          {activeTab === "scoreboard" && (
            <Leaderboard players={leaderboard} />
          )}

          {activeTab === "profile" && (
            <ProfileScreen
              username={activeUser.name}
              elo={activeUser.elo}
              completedTrips={activeUser.completedTrips}
            />
          )}

          {activeTab === "карта" && (
            <MapScreen />
          )}

          {activeTab === "создай свой ивент" && (
            <>
              {eventScreen === "room" && (
                <RoomScreen onPlanReady={handlePlanReady} />
              )}

              {eventScreen === "plan" && (
                <PlanView plan={plan} onNext={() => setEventScreen("proof")} />
              )}

              {eventScreen === "proof" && (
                <ProofScreen onProofReady={handleProofReady} />
              )}

              {eventScreen === "verdict" && (
                <VerdictCard
                  verdict={verdict}
                  onViewLeaderboard={handleShowLeaderboard}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Bottom Navigation Bar */}
      <div className="wireframe-bottomnav">
        <button
          className={`nav-item-btn ${activeTab === "главная" ? "active" : ""}`}
          onClick={() => setActiveTab("главная")}
        >
          <span>🏠</span>
          <span>главная</span>
        </button>

        <button
          className={`nav-item-btn ${activeTab === "Хиты" ? "active" : ""}`}
          onClick={() => setActiveTab("Хиты")}
        >
          <span>🔥</span>
          <span>Хиты</span>
        </button>

        <button
          className={`nav-item-btn ${activeTab === "scoreboard" ? "active" : ""}`}
          onClick={() => setActiveTab("scoreboard")}
        >
          <span>🏆</span>
          <span>scoreboard</span>
        </button>

        <button
          className={`nav-item-btn ${activeTab === "создай свой ивент" ? "active" : ""}`}
          onClick={() => setActiveTab("создай свой ивент")}
        >
          <span>✨</span>
          <span>создай свой ивент</span>
        </button>
      </div>
    </main>
  );
}
