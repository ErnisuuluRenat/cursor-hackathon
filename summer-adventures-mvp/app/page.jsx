"use client";

import { useState } from "react";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import ProofScreen from "@/components/proof/ProofScreen";
import VerdictCard from "@/components/proof/VerdictCard";
import PlanView from "@/components/room/PlanView";
import RoomScreen from "@/components/room/RoomScreen";

const USE_MOCKS = true;

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
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    elo: 1420,
    completedTrips: 12,
  },
  {
    id: "2",
    name: "Jordan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    elo: 1385,
    completedTrips: 9,
  },
  {
    id: "3",
    name: "Sam",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    elo: 1310,
    completedTrips: 7,
  },
];

export default function Home() {
  const [screen, setScreen] = useState("room");
  const [room, setRoom] = useState(null);
  const [plan, setPlan] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlanReady = async (activity, selectedMembers) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRoom({ activity, members: selectedMembers });
        setPlan(mockPlan);
        setScreen("plan");
      } else {
        const response = await fetch("http://localhost:8000/api/plan/", {
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
        setScreen("plan");
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
        setScreen("verdict");
      } else {
        const response = await fetch("http://localhost:8000/api/verify/", {
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
        setScreen("verdict");
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
        setScreen("leaderboard");
      } else {
        const response = await fetch("http://localhost:8000/api/leaderboard/");

        if (!response.ok) {
          throw new Error(`Leaderboard request failed (${response.status})`);
        }

        const data = await response.json();
        setLeaderboard(Array.isArray(data) ? data : (data.players ?? []));
        setScreen("leaderboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load leaderboard."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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

      {loading && screen !== "room" && (
        <div className="app-container">
          <p style={{ textAlign: "center", margin: 0 }}>Loading...</p>
        </div>
      )}

      {screen === "room" && <RoomScreen onPlanReady={handlePlanReady} />}

      {screen === "plan" && !loading && (
        <PlanView plan={plan} onNext={() => setScreen("proof")} />
      )}

      {screen === "proof" && !loading && (
        <ProofScreen onProofReady={handleProofReady} />
      )}

      {screen === "verdict" && !loading && (
        <VerdictCard
          verdict={verdict}
          onViewLeaderboard={handleShowLeaderboard}
        />
      )}

      {screen === "leaderboard" && !loading && (
        <Leaderboard players={leaderboard} />
      )}
    </main>
  );
}
