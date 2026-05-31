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
