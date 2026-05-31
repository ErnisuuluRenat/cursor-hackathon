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
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8080"
    : "https://cursor-hackathon-q7mw.onrender.com");

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

const STATUS_TO_API = {
  "In Planning": "planning",
  "Proof Pending": "proof_pending",
  Completed: "completed",
};

const toLobbyEvent = (trip) => ({
  id: trip.id,
  name: trip.name ?? trip.activity,
  members: trip.members,
  status: trip.statusLabel ?? trip.status,
});

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
  const [activeEvents, setActiveEvents] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard/`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(Array.isArray(data) ? data : (data.players ?? []));
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    }
  };

  // Auto-fetch leaderboard and trips on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [, tripsResponse] = await Promise.all([
          fetchLeaderboard(),
          fetch(`${API_BASE}/api/trips/`),
        ]);

        if (tripsResponse.ok) {
          const data = await tripsResponse.json();
          setActiveEvents((data.trips ?? []).map(toLobbyEvent));
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    fetchInitialData();
  }, []);

  const createTripOnServer = async (activity, selectedMembers) => {
    const memberNames = selectedMembers.map((m) => m.name);
    const members = memberNames.length > 0 ? `${memberNames.join(", ")}, You` : "You";

    const response = await fetch(`${API_BASE}/api/trips/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity,
        members,
        status: "planning",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save event (${response.status})`);
    }

    const data = await response.json();
    const trip = toLobbyEvent(data.trip);
    setActiveEvents((prev) => [trip, ...prev]);
    setCurrentEventId(trip.id);
    return trip.id;
  };

  const updateEventStatus = async (eventId, status, coolnessScore) => {
    if (!eventId) return;

    setActiveEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, status } : event))
    );

    if (USE_MOCKS) return;

    try {
      const payload = { status: STATUS_TO_API[status] ?? status };
      if (coolnessScore != null) {
        payload.coolnessScore = coolnessScore;
      }

      const response = await fetch(`${API_BASE}/api/trips/${eventId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedTrip = toLobbyEvent(data.trip);
        setActiveEvents((prev) =>
          prev.map((event) => (event.id === eventId ? updatedTrip : event))
        );
      }
    } catch (err) {
      console.error("Failed to update event status", err);
    }
  };

  const addActiveEvent = (activity, selectedMembers) => {
    const memberNames = selectedMembers.map((m) => m.name);
    const members = memberNames.length > 0 ? `${memberNames.join(", ")}, You` : "You";
    const newEvent = {
      id: Date.now(),
      name: activity,
      members,
      status: "In Planning",
    };
    setActiveEvents((prev) => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
    return newEvent.id;
  };

  const handlePlanReady = async (activity, selectedMembers) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCKS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRoom({ activity, members: selectedMembers });
        addActiveEvent(activity, selectedMembers);
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
        await createTripOnServer(activity, selectedMembers);
        setPlan(data.plan ?? data);
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
        await updateEventStatus(currentEventId, "Completed", mockVerdict.coolnessScore);
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
        const verdictData = data.verdict ?? data;
        setVerdict(verdictData);
        await updateEventStatus(
          currentEventId,
          "Completed",
          verdictData.coolnessScore ?? 60
        );
        setEventScreen("verdict");
        
        // Auto-update stats and post score
        await fetch(`${API_BASE}/api/score/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: 1,
            coolnessScore: verdictData.coolnessScore ?? 60
          })
        });

        // Re-fetch leaderboard to reflect fresh ELO
        await fetchLeaderboard();
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
      } else {
        await fetchLeaderboard();
      }
      setActiveTab("scoreboard");
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
            <LobbyScreen activeRooms={activeEvents} onNavigate={(tab) => setActiveTab(tab)} />
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
                <PlanView
                  plan={plan}
                  onNext={async () => {
                    await updateEventStatus(currentEventId, "Proof Pending");
                    setEventScreen("proof");
                  }}
                />
              )}

              {eventScreen === "proof" && (
                <ProofScreen
                  activity={room?.activity ?? ""}
                  onProofReady={handleProofReady}
                />
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
          onClick={async () => {
            setActiveTab("scoreboard");
            if (!USE_MOCKS) {
              await fetchLeaderboard();
            }
          }}
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
