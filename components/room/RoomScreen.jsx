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
        <label>Who&apos;s coming?</label>
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
