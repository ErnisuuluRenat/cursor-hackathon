import math

def apply_result(current_elo, coolness_score):
    # Simple ELO implementation for summer adventures
    # Base ELO: 1200
    # Gain: +10 per 10 coolness points (max +100 at coolness 100)
    elo_gain = math.ceil((coolness_score / 10) * 10)
    return max(800, current_elo + elo_gain)

def rank_players(players):
    return sorted(players, key=lambda p: p.get('elo', 1200), reverse=True)
