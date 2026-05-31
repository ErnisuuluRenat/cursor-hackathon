// Frozen data shapes — for reference only. Implement these shapes in your own code.

// User
// {
//   id: string,
//   name: string,
//   avatar: string (emoji),
// }

// Trip
// {
//   id: string,
//   activity: string,
//   plan: {
//     packingList: string[],
//     bestDay: string,
//     steps: string[],
//   },
//   status: 'planning' | 'done',
//   photoUrl?: string,
//   verdict?: {
//     verified: boolean,
//     reason: string,
//     coolnessScore: number, // 0-100
//   },
// }

// Player (Leaderboard Entry)
// {
//   id: string,
//   name: string,
//   avatar: string,
//   elo: number,
//   completedTrips: number,
// }

// ---- API Contract ----
// GET  /api/room          -> { room: { id, members: User[] } }
// POST /api/plan          { activity, members } -> { plan: { packingList, bestDay, steps } }
// POST /api/verify        { activity, image }   -> { verdict: { verified, reason, coolnessScore } }
// GET  /api/leaderboard   -> { players: Player[] }
// POST /api/score         { playerId, coolnessScore } -> { players: Player[] }

export {};
