'use client';
import { useState } from 'react';
import RoomScreen from '@/components/room/RoomScreen';
import PlanView from '@/components/room/PlanView';
import ProofScreen from '@/components/proof/ProofScreen';
import VerdictCard from '@/components/proof/VerdictCard';
import Leaderboard from '@/components/leaderboard/Leaderboard';

export default function Home() {
  const [screen, setScreen] = useState('room'); // 'room' | 'plan' | 'proof' | 'verdict' | 'leaderboard'
  const [room, setRoom] = useState(null);
  const [plan, setPlan] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePlanReady = async (activity, members) => {
    setLoading(true);
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, members }),
    });
    const data = await res.json();
    setPlan(data.plan);
    setScreen('plan');
    setLoading(false);
  };

  const handleProofReady = async (activity, imageBase64) => {
    setLoading(true);
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, image: imageBase64 }),
    });
    const data = await res.json();
    setVerdict(data.verdict);
    setScreen('verdict');

    // Persist the result to ELO, then auto-fetch leaderboard after proof verified
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: '1', coolnessScore: data.verdict.coolnessScore }),
    });

    const lbRes = await fetch('/api/leaderboard');
    const lbData = await lbRes.json();
    setLeaderboard(lbData.players);

    setLoading(false);
  };

  const handleShowLeaderboard = async () => {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    setLeaderboard(data.players);
    setScreen('leaderboard');
  };

  return (
    <main className="app-container">
      {loading && <div className="loading-overlay">✨ Gathering ideas for you...</div>}

      {screen === 'room' && (
        <RoomScreen onPlanReady={handlePlanReady} />
      )}
      {screen === 'plan' && (
        <PlanView plan={plan} onNext={() => setScreen('proof')} />
      )}
      {screen === 'proof' && (
        <ProofScreen onProofReady={handleProofReady} />
      )}
      {screen === 'verdict' && (
        <VerdictCard
          verdict={verdict}
          onViewLeaderboard={handleShowLeaderboard}
        />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard players={leaderboard} />
      )}
    </main>
  );
}
