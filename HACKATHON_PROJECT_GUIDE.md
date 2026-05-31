# 🚀 Summer Adventures Hackathon — 2-Hour MVP Guide

## Project Overview

**Project Name:** Summer Adventures ELO  
**Concept:** Strava for summer adventures — a gamified app where friends plan trips together, prove they did them with photos, and climb an ELO leaderboard based on how epic their activities were.

**Core Flow:**
1. User creates a room with friends and decides what adventure to do.
2. AI generates a complete trip plan (packing list, best day, steps).
3. User uploads photo proof of the adventure.
4. AI verifies the proof and rates its "coolness" (0–100).
5. User gets ELO points based on coolness and climbs the leaderboard.

**Time Constraint:** 2 hours  
**Team:** 3 developers  
**Deliverable:** A working MVP frontend + backend that can be demoed live.

---

## 👥 The Three-Developer Split

### **Dev 1: Frontend Specialist**
**Owns:** Everything users see and interact with.  
**Branches:** `feat/frontend`  
**Key Files:** `app/`, `components/`, styles.

### **Dev 2: Backend/API & Data Layer**
**Owns:** Server, APIs, data storage, request orchestration.  
**Branches:** `feat/backend`  
**Key Files:** `app/api/`, `lib/store.js`.

### **Dev 3: AI & Logic Functions**
**Owns:** All AI calls, all business logic, all calculations.  
**Branches:** `feat/ai`  
**Key Files:** `lib/ai.js`, `lib/planner.js`, `lib/verifier.js`, `lib/elo.js`.

---

## 🛠 Tech Stack

```
Frontend:        React (Next.js App Router)
Backend:         Next.js API Routes
AI:              Anthropic Claude API (claude-sonnet-4-20250514)
Styling:         CSS-in-JS / Tailwind (optional, but fast)
Data:            In-memory store (no real DB for MVP)
Environment:     Node.js 18+
```

**Why Next.js?** One repo, API routes are isolated files per feature (no conflicts), React + backend in one place, deploy-ready.

---

## 📁 Project Structure

```
summer-adventures-mvp/
├── app/
│   ├── page.jsx              (Dev 1: Main shell, screen routing)
│   ├── layout.jsx            (Dev 1: Root layout)
│   ├── globals.css           (Dev 1: Global theme & styles)
│   └── api/
│       ├── room/route.js     (Dev 2: GET room data)
│       ├── plan/route.js     (Dev 2: POST trip planning)
│       ├── verify/route.js   (Dev 2: POST photo verification)
│       ├── leaderboard/route.js  (Dev 2: GET leaderboard)
│       └── score/route.js    (Dev 2: POST update ELO)
├── components/
│   ├── room/
│   │   ├── RoomScreen.jsx    (Dev 1)
│   │   └── PlanView.jsx      (Dev 1)
│   ├── proof/
│   │   ├── ProofScreen.jsx   (Dev 1)
│   │   └── VerdictCard.jsx   (Dev 1)
│   └── leaderboard/
│       └── Leaderboard.jsx   (Dev 1)
├── lib/
│   ├── contracts.js          (TEAM: Frozen data shapes)
│   ├── store.js              (Dev 2: In-memory data + helpers)
│   ├── ai.js                 (Dev 3: Anthropic client)
│   ├── planner.js            (Dev 3: Trip planning logic)
│   ├── verifier.js           (Dev 3: Photo verification logic)
│   └── elo.js                (Dev 3: ELO calculation)
├── package.json
├── .env.local                (ANTHROPIC_API_KEY=your-key-here)
└── next.config.js
```

---

## 👨‍💻 Dev 1: Frontend — Complete UI

### Responsibilities
- **All React components** — build every screen users see.
- **All styling** — design system, theme, responsive layout.
- **State management** — manage current screen, room, plan, verdict, leaderboard in `app/page.jsx`.
- **API integration** — fetch from Dev 2's endpoints.
- **Loading/error states** — handle pending and failure gracefully.

### Files to Create

#### `app/page.jsx` (Main Shell & State)
```javascript
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
    
    // Auto-fetch leaderboard after proof verified
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
```

#### `components/room/RoomScreen.jsx`
```javascript
'use client';
import { useState } from 'react';

export default function RoomScreen({ onPlanReady }) {
  const [activity, setActivity] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockFriends = [
    { id: '2', name: 'Ali', avatar: '🧑' },
    { id: '3', name: 'Masha', avatar: '👩' },
  ];

  const handleToggleMember = (member) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  const handleGeneratePlan = async () => {
    if (!activity.trim()) {
      alert('Enter an activity!');
      return;
    }
    setLoading(true);
    await onPlanReady(activity, selectedMembers);
    setLoading(false);
  };

  return (
    <div className="room-screen">
      <h1>What adventure should we do?</h1>
      
      <div className="input-group">
        <label>Activity / Destination:</label>
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="e.g., Go to Japan, Play volleyball, etc."
        />
      </div>

      <div className="friends-group">
        <label>Who's coming?</label>
        {mockFriends.map(friend => (
          <button
            key={friend.id}
            className={`friend-btn ${selectedMembers.find(m => m.id === friend.id) ? 'selected' : ''}`}
            onClick={() => handleToggleMember(friend)}
          >
            {friend.avatar} {friend.name}
          </button>
        ))}
      </div>

      <button
        className="cta-button"
        onClick={handleGeneratePlan}
        disabled={loading}
      >
        {loading ? '✨ Planning...' : 'Generate Plan ✨'}
      </button>
    </div>
  );
}
```

#### `components/room/PlanView.jsx`
```javascript
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
```

#### `components/proof/ProofScreen.jsx`
```javascript
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
      const base64 = event.target?.result as string;
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
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? '⏳ Verifying...' : '📸 Upload Photo'}
        </button>
      </div>
    </div>
  );
}
```

#### `components/proof/VerdictCard.jsx`
```javascript
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
```

#### `components/leaderboard/Leaderboard.jsx`
```javascript
export default function Leaderboard({ players }) {
  if (!players || players.length === 0) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h1>🏆 Leaderboard</h1>
      
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>ELO</th>
            <th>Adventures</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, i) => (
            <tr key={player.id} className={i === 0 ? 'leader' : ''}>
              <td>#{i + 1}</td>
              <td>{player.avatar} {player.name}</td>
              <td className="elo">{Math.round(player.elo)}</td>
              <td>{player.completedTrips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### `app/globals.css` (Minimal Theme)
```css
:root {
  --primary: #ff6b6b;
  --secondary: #14b8a6;
  --bg: #ffd6a5;
  --text: #2d3436;
  --card: rgba(255, 250, 244, 0.95);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, var(--bg), #ff9e7d);
  color: var(--text);
  min-height: 100vh;
  padding: 20px;
}

.app-container {
  max-width: 500px;
  margin: 0 auto;
  background: var(--card);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: var(--primary);
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 8px;
}

.input-group input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.cta-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary), #ff5e62);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover:not(:disabled) {
  transform: scale(1.05);
}

.cta-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.friends-group {
  margin-bottom: 20px;
}

.friends-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
}

.friend-btn {
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
  padding: 10px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.friend-btn.selected {
  background: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

.plan-section {
  margin-bottom: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
}

.plan-section h3 {
  margin-bottom: 12px;
  color: var(--primary);
}

.plan-section ul,
.plan-section ol {
  padding-left: 24px;
}

.plan-section li {
  margin-bottom: 8px;
}

.verdict-card {
  text-align: center;
}

.verdict-result {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.verdict-result.verified h2 {
  color: green;
}

.verdict-result.unverified h2 {
  color: red;
}

.coolness-score {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid var(--primary);
}

.score-display {
  font-size: 48px;
  font-weight: bold;
  color: var(--primary);
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.leaderboard-table th {
  background: var(--primary);
  color: white;
  font-weight: 600;
}

.leaderboard-table tr.leader {
  background: #fff9e6;
  font-weight: 600;
}

.leaderboard-table .elo {
  color: var(--primary);
  font-weight: 600;
}
```

### Checklist for Dev 1
- [ ] Create `app/page.jsx` with state management and screen routing
- [ ] Create `app/layout.jsx` and `app/globals.css` with theme
- [ ] Build `RoomScreen.jsx` — activity input + friend selection
- [ ] Build `PlanView.jsx` — display AI plan
- [ ] Build `ProofScreen.jsx` — photo upload
- [ ] Build `VerdictCard.jsx` — show verdict + score
- [ ] Build `Leaderboard.jsx` — display ranked players
- [ ] Wire all components together in `page.jsx`
- [ ] Test against mocked API responses
- [ ] Add loading states and error handling
- [ ] Polish styling and responsive design

---

## ⚙️ Dev 2: Backend/API & Data

### Responsibilities
- **All API routes** — five endpoints that Dev 1 calls.
- **Data storage** — in-memory store with pre-seeded data.
- **Request handling** — validate inputs, call Dev 3's functions, return responses.
- **Orchestration** — wire Dev 3's AI functions into the API flow.

### Files to Create

#### `lib/store.js` (Data Store)
```javascript
// In-memory data store for MVP

let currentUser = {
  id: '1',
  name: 'You',
  avatar: '😎',
};

let room = {
  id: 'room-1',
  members: [
    currentUser,
    { id: '2', name: 'Ali', avatar: '🧑' },
    { id: '3', name: 'Masha', avatar: '👩' },
  ],
};

let trips = [];

let players = [
  { id: '1', name: 'You', avatar: '😎', elo: 1250, completedTrips: 1 },
  { id: '4', name: 'John', avatar: '🧔', elo: 1400, completedTrips: 5 },
  { id: '5', name: 'Sarah', avatar: '👱', elo: 1350, completedTrips: 4 },
  { id: '6', name: 'Mike', avatar: '👨', elo: 1100, completedTrips: 2 },
  { id: '7', name: 'Emma', avatar: '👧', elo: 950, completedTrips: 0 },
];

export function getRoom() {
  return room;
}

export function saveTrip(trip) {
  trips.push(trip);
  return trip;
}

export function getTrip(id) {
  return trips.find(t => t.id === id);
}

export function getPlayers() {
  return players.sort((a, b) => b.elo - a.elo);
}

export function updatePlayer(id, patch) {
  const player = players.find(p => p.id === id);
  if (player) {
    Object.assign(player, patch);
  }
  return player;
}
```

#### `app/api/room/route.js`
```javascript
import { getRoom } from '@/lib/store';

export async function GET() {
  const room = getRoom();
  return Response.json({ room });
}
```

#### `app/api/plan/route.js`
```javascript
import { generatePlan } from '@/lib/planner';

export async function POST(request) {
  const { activity, members } = await request.json();

  try {
    const plan = await generatePlan({ activity, members, location: 'current' });
    return Response.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    return Response.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
```

#### `app/api/verify/route.js`
```javascript
import { verifyProof } from '@/lib/verifier';

export async function POST(request) {
  const { activity, image } = await request.json();

  try {
    const verdict = await verifyProof({ activity, imageBase64: image });
    return Response.json({ verdict });
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json(
      { error: 'Failed to verify proof' },
      { status: 500 }
    );
  }
}
```

#### `app/api/leaderboard/route.js`
```javascript
import { getPlayers } from '@/lib/store';

export async function GET() {
  const players = getPlayers();
  return Response.json({ players });
}
```

#### `app/api/score/route.js`
```javascript
import { applyResult } from '@/lib/elo';
import { updatePlayer, getPlayers } from '@/lib/store';

export async function POST(request) {
  const { playerId, coolnessScore } = await request.json();

  try {
    const player = updatePlayer(playerId, {});
    if (!player) {
      return Response.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const newElo = applyResult(player.elo, coolnessScore);
    updatePlayer(playerId, { elo: newElo, completedTrips: (player.completedTrips || 0) + 1 });

    const players = getPlayers();
    return Response.json({ players });
  } catch (error) {
    console.error('Score update error:', error);
    return Response.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}
```

### Checklist for Dev 2
- [ ] Create `lib/store.js` with in-memory data and helper functions
- [ ] Create all 5 API route files
- [ ] Test routes with mocked responses (before Dev 3's functions are ready)
- [ ] Verify request/response shapes match contracts
- [ ] Wire Dev 3's functions into routes once they're ready
- [ ] Handle errors gracefully
- [ ] Test end-to-end flow with Dev 1 and Dev 3

---

## 🤖 Dev 3: AI & Logic Functions

### Responsibilities
- **AI client** — wrapper around Anthropic API for Dev 2 to use.
- **Trip planning logic** — generatePlan() function.
- **Photo verification logic** — verifyProof() function with vision.
- **ELO calculation** — applyResult() and rankPlayers().

### Files to Create

#### `lib/ai.js` (Anthropic Client)
```javascript
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY not set');
}

export async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

export async function callClaudeVision(prompt, imageBase64) {
  // Remove data:image/...;base64, prefix if present
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude Vision API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}
```

#### `lib/planner.js` (Trip Planning)
```javascript
import { callClaude } from './ai';

export async function generatePlan({ activity, members, location }) {
  const memberNames = members.map(m => m.name).join(', ');

  const prompt = `
You are a trip planning AI. Generate a concise travel plan for:
- Activity: ${activity}
- Participants: ${memberNames}
- Location: ${location}

Return a JSON object (ONLY JSON, no markdown) with:
{
  "packingList": ["item1", "item2", ...],
  "bestDay": "Saturday" or specific date,
  "steps": ["Step 1: ...", "Step 2: ...", ...]
}

Keep it concise and fun.
  `.trim();

  const response = await callClaude(prompt);

  try {
    const json = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    return json;
  } catch (e) {
    console.error('Failed to parse plan response:', response);
    return {
      packingList: ['Camera', 'Passport', 'Comfortable shoes'],
      bestDay: 'Saturday',
      steps: ['Book flights', 'Prepare itinerary', 'Pack bags', 'Have fun!'],
    };
  }
}
```

#### `lib/verifier.js` (Photo Verification)
```javascript
import { callClaudeVision } from './ai';

export async function verifyProof({ activity, imageBase64 }) {
  const prompt = `
Look at this photo. The user claims they did: "${activity}"

Answer ONLY with a JSON object (no markdown, no extra text):
{
  "verified": true or false,
  "reason": "brief explanation (1-2 sentences)",
  "coolnessScore": number between 0 and 100
}

Guidelines:
- Coolness score: 80+ for epic trips (international, unique, adventurous)
- Coolness score: 50-79 for good local activities
- Coolness score: 0-49 for basic activities
- If you can't tell if it matches the activity, set verified: false
  `.trim();

  const response = await callClaudeVision(prompt, imageBase64);

  try {
    const json = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    return {
      verified: json.verified ?? true,
      reason: json.reason ?? 'Photo verified',
      coolnessScore: Math.min(100, Math.max(0, json.coolnessScore ?? 50)),
    };
  } catch (e) {
    console.error('Failed to parse verdict response:', response);
    // Fallback verdict
    return {
      verified: true,
      reason: 'Photo received (AI verification pending)',
      coolnessScore: 60,
    };
  }
}
```

#### `lib/elo.js` (ELO Calculation)
```javascript
// Simple ELO implementation for summer adventures
// Base ELO: 1200
// Gain: +10 per 10 coolness points (max +100 at coolness 100)

export function applyResult(currentElo, coolnessScore) {
  const eloGain = Math.ceil((coolnessScore / 10) * 10);
  return Math.max(800, currentElo + eloGain);
}

export function rankPlayers(players) {
  return players.sort((a, b) => b.elo - a.elo);
}
```

### Checklist for Dev 3
- [ ] Create `lib/ai.js` with Anthropic client
- [ ] Create `lib/planner.js` with trip generation
- [ ] Create `lib/verifier.js` with photo verification
- [ ] Create `lib/elo.js` with ELO logic
- [ ] Test each function independently with real API calls
- [ ] Handle errors gracefully (return fallback data)
- [ ] Ensure JSON parsing is robust
- [ ] Verify API responses match expected shapes
- [ ] Test integration with Dev 2's routes

---

## 📋 Data Contracts (Frozen at Scaffold)

### Data Shapes
```javascript
// lib/contracts.js (for reference only — implement in your own code)

// User
{
  id: string,
  name: string,
  avatar: string (emoji),
}

// Trip
{
  id: string,
  activity: string,
  plan: {
    packingList: string[],
    bestDay: string,
    steps: string[],
  },
  status: 'planning' | 'done',
  photoUrl?: string,
  verdict?: {
    verified: boolean,
    reason: string,
    coolnessScore: number, // 0-100
  },
}

// Player (Leaderboard Entry)
{
  id: string,
  name: string,
  avatar: string,
  elo: number,
  completedTrips: number,
}
```

### API Contract
```
GET  /api/room
  Response: { room: { id, members: User[] } }

POST /api/plan
  Body:     { activity: string, members: User[] }
  Response: { plan: { packingList, bestDay, steps } }

POST /api/verify
  Body:     { activity: string, image: base64 }
  Response: { verdict: { verified, reason, coolnessScore } }

GET  /api/leaderboard
  Response: { players: Player[] }

POST /api/score
  Body:     { playerId: string, coolnessScore: number }
  Response: { players: Player[] (updated) }
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- An Anthropic API key (https://console.anthropic.com)

### Initial Setup (0:00–0:15)

1. **Create Next.js project:**
   ```bash
   npx create-next-app@latest summer-adventures-mvp --typescript=no --tailwind=no
   cd summer-adventures-mvp
   ```

2. **Create folder structure:**
   ```bash
   mkdir -p components/room components/proof components/leaderboard lib
   ```

3. **Create `.env.local`:**
   ```
   ANTHROPIC_API_KEY=your-api-key-here
   ```

4. **Create `lib/contracts.js`** (empty file for now, just documentation):
   ```javascript
   // See contracts section above
   ```

5. **Commit scaffold to `main`:**
   ```bash
   git add .
   git commit -m "Initial scaffold"
   ```

### Individual Dev Setup (0:15 onwards)

**Dev 1:**
```bash
git checkout -b feat/frontend
# Build all component files
```

**Dev 2:**
```bash
git checkout -b feat/backend
# Create lib/store.js and all api/ routes
```

**Dev 3:**
```bash
git checkout -b feat/ai
# Create lib/ai.js, lib/planner.js, lib/verifier.js, lib/elo.js
```

---

## ⏰ Timeline

| Time | Dev 1 | Dev 2 | Dev 3 |
|------|-------|-------|-------|
| **0:00–0:15** | **TEAM: Scaffold & setup** | | |
| **0:15–1:15** | Build all screens against mocked APIs | Build API routes returning mocks | Build AI functions with real API |
| **1:15–1:30** | Polish UI, add loading states | Integrate Dev 3's functions into routes | Finalize & test all functions |
| **1:30–1:50** | Final styling & micro-interactions | Test end-to-end API flow | Debug any AI issues |
| **1:50–2:00** | Full integration test + demo dry-run | | |

---

## 🌳 Git Workflow

### Branches
```
main                (scaffold only, frozen)
├── feat/frontend   (Dev 1)
├── feat/backend    (Dev 2)
└── feat/ai         (Dev 3)
```

### How to Merge
1. **Dev 3 merges first** (no dependencies):
   ```bash
   git checkout main
   git pull
   git checkout feat/ai
   git rebase main
   git checkout main
   git merge feat/ai
   ```

2. **Dev 2 merges second** (depends on Dev 3):
   ```bash
   git checkout main
   git pull
   git checkout feat/backend
   git rebase main
   # Resolve any conflicts (unlikely — different files)
   git checkout main
   git merge feat/backend
   ```

3. **Dev 1 merges last** (integrator):
   ```bash
   git checkout main
   git pull
   git checkout feat/frontend
   git rebase main
   git checkout main
   git merge feat/frontend
   ```

---

## 🎭 Mocking Strategy

### Early Development
While waiting for dependencies, return **mock data** so all devs can work in parallel:

**Dev 1** calls mock API:
```javascript
// Temporary mock in components
const mockPlan = {
  packingList: ['Passport', 'Camera', 'Sunscreen'],
  bestDay: 'Saturday',
  steps: ['Book flight', 'Pack', 'Go!'],
};
```

**Dev 2** returns mock responses:
```javascript
// In route handlers during development
if (!process.env.ANTHROPIC_API_KEY) {
  return Response.json({
    plan: {
      packingList: ['Item 1', 'Item 2'],
      bestDay: 'Saturday',
      steps: ['Step 1', 'Step 2'],
    },
  });
}
```

**Dev 3** logs output and tests locally:
```bash
node -e "import('./lib/planner.js').then(m => m.generatePlan({...}))"
```

### Integration Phase
Remove mocks and wire real functions together.

---

## ✅ Integration Checklist

- [ ] All three branches merged into `main`
- [ ] No console errors in browser DevTools
- [ ] Room screen → tap button → calls `/api/plan` → shows plan ✅
- [ ] Plan view → tap "We Did It" → goes to proof screen ✅
- [ ] Proof screen → upload photo → calls `/api/verify` → shows verdict ✅
- [ ] Verdict → tap "See Leaderboard" → calls `/api/leaderboard` → shows ranked players ✅
- [ ] Leaderboard reflects updated ELO after verification ✅
- [ ] All text is displayed correctly
- [ ] All buttons are clickable and working
- [ ] No network errors in Console
- [ ] Load times are reasonable (<5 seconds per API call)
- [ ] Mobile responsive (test on mobile browser)

---

## 🎯 Golden Rules

1. **Dev 1 never edits `app/api/` or `lib/`** (except following imports).
2. **Dev 2 never edits `components/` or `app/page.jsx`**.
3. **Dev 3 never edits `app/` or API routes**.
4. **Don't touch `lib/contracts.js` or `package.json`** after scaffold without team agreement.
5. **Shared API contracts are FROZEN at 0:15** — any change must be discussed with all three.
6. **Always return data in the agreed JSON shape** — mismatches break integration.
7. **Use console.error() for debugging**, not console.log() spam.
8. **Test against mocks first, then real API** — keeps integration clean.

---

## 🐛 Common Issues & Solutions

### "Cannot find module 'X'"
- Check import paths are correct: `@/lib/something` not `./lib/something`.
- Run `npm install` if you added dependencies.

### "API is returning 500 error"
- Check `.env.local` has `ANTHROPIC_API_KEY` set.
- Check function signatures match what Dev 2 expects.
- Log errors in route handlers to see what's wrong.

### "Frontend shows loading forever"
- Check browser Network tab for API response.
- Check API logs (`console.error` in route).
- Verify JSON response shape matches contract.

### "ELO not updating"
- Verify Dev 2 is calling `applyResult()` from Dev 3.
- Check `/api/leaderboard` returns fresh data after `/api/score`.
- Verify `updatePlayer()` in store is being called.

### "Photo verification is failing"
- Check image Base64 encoding (remove `data:...;base64,` prefix).
- Check Claude Vision API key is valid.
- Verify image is being sent as valid base64.

---

## 🎬 Demo Script (for 3-min pitch)

1. **Setup** (30 sec): "We built a gamified summer adventures app where friends plan trips together."
2. **Flow** (90 sec):
   - Input: "Go to Japan" + select friends.
   - Tap "Generate Plan" → AI builds a packing list and timeline.
   - Tap "We Did It" → upload a photo.
   - AI verifies the photo and rates its "coolness" (e.g., 85/100).
   - Auto-show leaderboard → player climbed ELO ranking.
3. **Impact** (30 sec): "It's Strava for summer adventures — competitive, shareable, AI-powered. You can play with friends and see who's having the best summer."

---

## 📝 Summary

- **Dev 1** builds the entire UI from scratch against mocked APIs.
- **Dev 2** builds all 5 API endpoints, manages data, and wires Dev 3's functions.
- **Dev 3** builds all AI logic and functions.
- **Everyone** starts with the frozen scaffold and merges at the end.
- **No conflicts** because each dev owns completely separate files.
- **Parallelization** because mocks let everyone work simultaneously.
- **2 hours** to a working MVP that can be demoed live.

Good luck! 🚀
